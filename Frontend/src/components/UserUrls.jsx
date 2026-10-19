import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChartColumn, ChevronLeft, ChevronRight, Link2, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteUrl, getUserUrls } from "../api/ShortUrl.api.jsx";
import { formatDate, getErrorMessage } from "../utils/helper.js";
import { useDashboard } from "./dashboard/DashboardLayout.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import CopyButton from "./CopyButton.jsx";
import EditLinkModal from "./EditLinkModal.jsx";
import StatusBadge from "./StatusBadge.jsx";

const PAGE_SIZE = 10;

const iconButton =
  "grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-white/10 bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink";

// Without the protocol the address is easier to scan. The full link stays in the href and the tooltip.
const display = (shortUrl) => shortUrl.replace(/^https?:\/\//, "");

const LinkActions = ({ url, onEdit, onDelete }) => (
  <div className="flex items-center gap-1.5">
    <CopyButton compact text={url.shortUrl} />
    <Link
      to="/analytics/$code"
      params={{ code: url.shortCode }}
      className={iconButton}
      aria-label={`Analytics for ${url.shortCode}`}
      title="Analytics"
    >
      <ChartColumn size={15} aria-hidden="true" />
    </Link>
    <button type="button" className={iconButton} onClick={() => onEdit(url)} aria-label={`Edit ${url.shortCode}`} title="Edit">
      <Pencil size={15} aria-hidden="true" />
    </button>
    <button
      type="button"
      className={`${iconButton} hover:!border-danger/40 hover:!bg-danger-soft hover:!text-danger`}
      onClick={() => onDelete(url)}
      aria-label={`Delete ${url.shortCode}`}
      title="Delete"
    >
      <Trash2 size={15} aria-hidden="true" />
    </button>
  </div>
);

const ShortLink = ({ url }) => (
  <div className="flex min-w-0 items-center gap-2">
    <a
      href={url.shortUrl}
      target="_blank"
      rel="noreferrer"
      title={url.shortUrl}
      className="truncate font-medium text-brand-text transition hover:text-white hover:underline"
    >
      {display(url.shortUrl)}
    </a>
    {url.isProtected && (
      <span title="Password protected" className="shrink-0 text-muted">
        <Lock size={13} aria-label="Password protected" />
      </span>
    )}
  </div>
);

const Skeleton = () => (
  <div className="card overflow-hidden p-0" role="status" aria-label="Loading your links">
    {[0, 1, 2, 3, 4].map((row) => (
      <div key={row} className="flex items-center gap-4 border-b border-white/6 px-5 py-4 last:border-0">
        <div className="h-4 w-40 rounded bg-white/10 motion-safe:animate-pulse" />
        <div className="hidden h-4 flex-1 rounded bg-white/6 motion-safe:animate-pulse md:block" />
        <div className="h-4 w-14 rounded bg-white/10 motion-safe:animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-white/10 motion-safe:animate-pulse" />
      </div>
    ))}
  </div>
);

const UserUrls = () => {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const queryClient = useQueryClient();
  const { openCreate } = useDashboard();

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useQuery({
    queryKey: ["urls", page],
    queryFn: () => getUserUrls({ page, limit: PAGE_SIZE }),
    // Keep showing the old page while the next one loads, so the table does not jump.
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setDeleting(null);
    },
  });

  // Deleting the last link on a page leaves it empty, so step back one page.
  useEffect(() => {
    if (data && data.urls.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data, page]);

  const cancelDelete = () => {
    if (remove.isPending) return;
    remove.reset();
    setDeleting(null);
  };

  if (isPending) return <Skeleton />;

  if (isError) {
    return (
      <div className="card space-y-4">
        <p role="alert" className="error-text">
          {getErrorMessage(error)}
        </p>
        <button type="button" className="btn-ghost" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (data.total === 0) {
    return (
      <div className="card flex flex-col items-center px-6 py-16 text-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl border border-brand/30 text-brand-text"
          style={{ backgroundImage: "linear-gradient(135deg, rgba(109,77,242,0.25), rgba(59,108,240,0.15))" }}
        >
          <Link2 size={26} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold tracking-tight">No links yet</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Links you create while logged in show up here, with their status and click counts.
        </p>
        <button type="button" className="btn-primary mt-6" onClick={openCreate}>
          <Plus size={17} aria-hidden="true" />
          Create your first link
        </button>
      </div>
    );
  }

  const from = (data.page - 1) * data.limit + 1;
  const to = from + data.urls.length - 1;

  return (
    <>
      <div className="card overflow-hidden !p-0">
        <div className={`transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
          {/* Table from md up */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs tracking-wider text-faint uppercase">
                  <th scope="col" className="px-5 py-3.5 font-medium">Short link</th>
                  <th scope="col" className="px-3 py-3.5 font-medium">Destination</th>
                  <th scope="col" className="px-3 py-3.5 text-right font-medium">Clicks</th>
                  <th scope="col" className="px-3 py-3.5 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3.5 font-medium">Created</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.urls.map((url) => (
                  <tr key={url.id} className="border-b border-white/6 transition-colors last:border-0 hover:bg-white/[0.03]">
                    <td className="max-w-[15rem] px-5 py-4">
                      <ShortLink url={url} />
                    </td>
                    <td className="max-w-[18rem] px-3 py-4">
                      <p className="truncate text-muted" title={url.fullUrl}>
                        {url.fullUrl}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-right font-medium tabular-nums">{url.clicks}</td>
                    <td className="px-3 py-4">
                      <StatusBadge url={url} />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-muted">{formatDate(url.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <LinkActions url={url} onEdit={setEditing} onDelete={setDeleting} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards below md */}
          <ul className="divide-y divide-white/8 md:hidden">
            {data.urls.map((url) => (
              <li key={url.id} className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <ShortLink url={url} />
                  <StatusBadge url={url} />
                </div>
                <p className="truncate text-sm text-muted" title={url.fullUrl}>
                  {url.fullUrl}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-faint">
                    <span className="font-semibold text-ink tabular-nums">{url.clicks}</span>{" "}
                    {url.clicks === 1 ? "click" : "clicks"} &middot; {formatDate(url.createdAt)}
                  </p>
                  <LinkActions url={url} onEdit={setEditing} onDelete={setDeleting} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <nav
          className="flex items-center justify-between gap-3 border-t border-white/8 px-4 py-3 sm:px-5"
          aria-label="Pagination"
        >
          <p className="text-sm text-muted">
            Showing <span className="font-medium text-ink tabular-nums">{from}-{to}</span> of{" "}
            <span className="font-medium text-ink tabular-nums">{data.total}</span>
          </p>
          {data.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-ghost h-9 px-3"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <span className="min-w-16 text-center text-sm text-muted tabular-nums">
                {data.page} / {data.totalPages}
              </span>
              <button
                type="button"
                className="btn-ghost h-9 px-3"
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* key makes a fresh form (and fresh values) for every link that is opened */}
      {editing && <EditLinkModal key={editing.id} url={editing} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this link?"
        confirmLabel="Delete link"
        pending={remove.isPending}
        error={remove.isError ? getErrorMessage(remove.error) : ""}
        onCancel={cancelDelete}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      >
        <p>
          <span className="font-mono text-ink">{deleting ? display(deleting.shortUrl) : ""}</span> will
          stop working and its click history is removed. This cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default UserUrls;
