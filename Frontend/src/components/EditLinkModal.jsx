import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, X } from "lucide-react";
import { updateUrl } from "../api/ShortUrl.api.jsx";
import { fromDateTimeLocal, getErrorMessage, toDateTimeLocal } from "../utils/helper.js";

const EditLinkModal = ({ url, onClose }) => {
  const dialogRef = useRef(null);
  const queryClient = useQueryClient();

  const initial = {
    fullUrl: url.fullUrl,
    activeFrom: toDateTimeLocal(url.activeFrom),
    expiresAt: toDateTimeLocal(url.expiresAt),
  };
  const [form, setForm] = useState(initial);

  // A native <dialog> gives focus handling, the Escape key and a backdrop for free.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const save = useMutation({
    mutationFn: (body) => updateUrl(url.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      onClose();
    },
  });

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send only what changed. Re-sending an old date that is already in the past would be rejected.
    // An emptied date field is sent as null, which clears it on the server.
    const body = {};
    if (form.fullUrl.trim() !== initial.fullUrl) body.url = form.fullUrl.trim();
    if (form.activeFrom !== initial.activeFrom) {
      body.activeFrom = form.activeFrom ? fromDateTimeLocal(form.activeFrom) : null;
    }
    if (form.expiresAt !== initial.expiresAt) {
      body.expiresAt = form.expiresAt ? fromDateTimeLocal(form.expiresAt) : null;
    }

    if (Object.keys(body).length === 0) {
      onClose();
      return;
    }

    save.mutate(body);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && !save.isPending && onClose()}
      aria-labelledby="edit-link-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-white/10 bg-bg-2 p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="edit-link-title" className="font-display text-xl font-extrabold tracking-tight">
              Edit link
            </h2>
            <p className="mt-1 truncate font-mono text-sm text-brand-text">
              {url.shortUrl.replace(/^https?:\/\//, "")}
            </p>
          </div>
          <button type="button" className="btn-ghost h-9 w-9 shrink-0 px-0" onClick={onClose} aria-label="Close">
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <div>
          <label htmlFor="edit-url" className="label">
            Destination
          </label>
          <input
            id="edit-url"
            type="url"
            required
            className="input"
            value={form.fullUrl}
            onChange={update("fullUrl")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-active" className="label">
              Active from
            </label>
            <input
              id="edit-active"
              type="datetime-local"
              className="input"
              value={form.activeFrom}
              onChange={update("activeFrom")}
            />
          </div>
          <div>
            <label htmlFor="edit-expires" className="label">
              Expires at
            </label>
            <input
              id="edit-expires"
              type="datetime-local"
              className="input"
              value={form.expiresAt}
              onChange={update("expiresAt")}
            />
          </div>
        </div>
        <p className="text-xs text-faint">Clear a date to remove it. The short code cannot change.</p>

        {save.isError && (
          <p role="alert" className="error-text">
            {getErrorMessage(save.error)}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {save.isPending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
            {save.isPending ? "Saving" : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default EditLinkModal;
