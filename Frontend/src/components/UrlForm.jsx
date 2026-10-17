import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Download, ExternalLink, Zap } from "lucide-react";
import { createShortUrl } from "../api/ShortUrl.api.jsx";
import { fromDateTimeLocal, getErrorMessage } from "../utils/helper.js";
import CopyButton from "./CopyButton.jsx";

const emptyForm = { url: "", slug: "", password: "", activeFrom: "", expiresAt: "" };

const UrlForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [showOptions, setShowOptions] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createShortUrl,
    // A new link changes the "My links" list.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["urls"] }),
  });

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Only send the options the person filled in, empty ones mean "not used".
    const body = { url: form.url.trim() };
    if (form.slug.trim()) body.slug = form.slug.trim();
    if (form.password) body.password = form.password;
    if (form.activeFrom) body.activeFrom = fromDateTimeLocal(form.activeFrom);
    if (form.expiresAt) body.expiresAt = fromDateTimeLocal(form.expiresAt);

    create.mutate(body);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="url" className="label">
            Long URL
          </label>
          <input
            id="url"
            type="url"
            required
            className="input"
            placeholder="https://example.com/a/very/long/address"
            value={form.url}
            onChange={update("url")}
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
          aria-expanded={showOptions}
          onClick={() => setShowOptions(!showOptions)}
        >
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={showOptions ? "rotate-180 transition" : "transition"}
          />
          More options
        </button>

        {showOptions && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className="label">
                Custom short code
              </label>
              <input
                id="slug"
                className="input"
                placeholder="my-launch"
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_\-]+"
                title="Letters, numbers, - or _"
                value={form.slug}
                onChange={update("slug")}
              />
            </div>
            <div>
              <label htmlFor="link-password" className="label">
                Password
              </label>
              <input
                id="link-password"
                type="password"
                autoComplete="new-password"
                className="input"
                placeholder="Optional, 4 or more characters"
                minLength={4}
                value={form.password}
                onChange={update("password")}
              />
            </div>
            <div>
              <label htmlFor="activeFrom" className="label">
                Active from
              </label>
              <input
                id="activeFrom"
                type="datetime-local"
                className="input"
                value={form.activeFrom}
                onChange={update("activeFrom")}
              />
            </div>
            <div>
              <label htmlFor="expiresAt" className="label">
                Expires at
              </label>
              <input
                id="expiresAt"
                type="datetime-local"
                className="input"
                value={form.expiresAt}
                onChange={update("expiresAt")}
              />
            </div>
          </div>
        )}

        {create.isError && (
          <p role="alert" className="error-text">
            {getErrorMessage(create.error)}
          </p>
        )}

        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={create.isPending}>
          <Zap size={16} aria-hidden="true" />
          {create.isPending ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {create.isSuccess && (
        <div className="card flex flex-col gap-5 sm:flex-row sm:items-center" aria-live="polite">
          <img
            src={create.data.qrCode}
            alt="QR code for the short link"
            width="140"
            height="140"
            className="h-35 w-35 shrink-0 rounded-lg border border-line bg-white p-1"
          />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm font-medium text-muted">Your short link</p>
            <a
              href={create.data.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-all font-display text-xl font-semibold text-brand hover:underline"
            >
              {create.data.shortUrl}
            </a>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={create.data.shortUrl} label="Copy link" />
              <a href={create.data.qrCode} download="ziplink-qr.png" className="btn-ghost">
                <Download size={16} aria-hidden="true" />
                Download QR
              </a>
              <a href={create.data.shortUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <ExternalLink size={16} aria-hidden="true" />
                Open
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
