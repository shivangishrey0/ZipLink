import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Lock,
  LoaderCircle,
  MousePointerClick,
  Pencil,
  Trash2,
} from "lucide-react";
import { deleteUrl, getUserUrls } from "../api/ShortUrl.api.jsx";
import { formatDate, formatDateTime, getErrorMessage } from "../utils/helper.js";
import CopyButton from "./CopyButton.jsx";
import EditLinkModal from "./EditLinkModal.jsx";
import StatusBadge from "./StatusBadge.jsx";

const PAGE_SIZE = 10;

const UserUrls = () => {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["urls", page],
    queryFn: () => getUserUrls({ page, limit: PAGE_SIZE }),
    // Keep showing the old page while the next one loads, so the list does not jump.
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["urls"] }),
  });

  // Deleting the last link on a page leaves it empty, so step back one page.
  useEffect(() => {
    if (data && data.urls.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data, page]);

  const handleDelete = (url) => {
    if (window.confirm(`Delete ${url.shortCode}? Its short link will stop working.`)) {
      remove.mutate(url.id);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-16 text-muted" role="status" aria-label="Loading links">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="error-text">
        {getErrorMessage(error)}
      </p>
    );
  }

  if (data.total === 0) {
    return (
      <div className="card space-y-3 py-12 text-center">
        <p className="font-display text-xl font-semibold">No links yet</p>
        <p className="text-sm text-muted">Links you create while logged in show up here.</p>
        <div>
          <Link to="/" className="btn-primary">
            Create your first link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {remove.isError && (
        <p role="alert" className="error-text">
          {getErrorMessage(remove.error)}
        </p>
      )}

      <ul className={`space-y-3 ${isPlaceholderData ? "opacity-60" : ""}`}>
        {data.urls.map((url) => {
          return (
            <li key={url.id} className="card space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-display text-lg font-semibold text-brand hover:underline"
                >
                  {url.shortUrl}
                </a>
                <StatusBadge url={url} />
                {url.isProtected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2.5 py-0.5 text-xs font-medium text-muted">
                    <Lock size={12} aria-hidden="true" />
                    Password
                  </span>
                )}
              </div>

              <p className="truncate text-sm text-muted" title={url.fullUrl}>
                {url.fullUrl}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                    <MousePointerClick size={15} aria-hidden="true" />
                    {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                  </span>
                  <span>Created {formatDate(url.createdAt)}</span>
                  {url.expiresAt && <span>Expires {formatDateTime(url.expiresAt)}</span>}
                </p>

                <div className="flex flex-wrap gap-2">
                  <CopyButton text={url.shortUrl} />
                  <Link to="/analytics/$code" params={{ code: url.shortCode }} className="btn-ghost">
                    <ChartColumn size={16} aria-hidden="true" />
                    Analytics
                  </Link>
                  <button type="button" className="btn-ghost" onClick={() => setEditing(url)}>
                    <Pencil size={16} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(url)}
                    disabled={remove.isPending}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.totalPages > 1 && (
        <nav className="flex items-center justify-between" aria-label="Pagination">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setPage(page + 1)}
            disabled={page >= data.totalPages}
          >
            Next
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}

      {/* key makes a fresh form (and fresh values) for every link that is opened */}
      {editing && <EditLinkModal key={editing.id} url={editing} onClose={() => setEditing(null)} />}
    </div>
  );
};

export default UserUrls;
