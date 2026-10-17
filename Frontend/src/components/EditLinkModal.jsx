import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
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
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-line bg-surface p-0 text-ink backdrop:bg-black/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold">Edit link</h2>
            <p className="truncate text-sm text-muted">{url.shortUrl}</p>
          </div>
          <button type="button" className="btn-ghost px-2.5" onClick={onClose} aria-label="Close">
            <X size={16} aria-hidden="true" />
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
        <p className="text-xs text-muted">Clear a date to remove it. The short code cannot change.</p>

        {save.isError && (
          <p role="alert" className="error-text">
            {getErrorMessage(save.error)}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default EditLinkModal;
