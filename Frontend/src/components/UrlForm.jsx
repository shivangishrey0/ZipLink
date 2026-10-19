import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Download,
  ExternalLink,
  Link2,
  LoaderCircle,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { createShortUrl } from "../api/ShortUrl.api.jsx";
import { fromDateTimeLocal, getErrorMessage } from "../utils/helper.js";
import CopyButton from "./CopyButton.jsx";

const emptyForm = { url: "", slug: "", password: "", activeFrom: "", expiresAt: "" };

// The same rules the server applies, so a mistake is caught before the request is sent.
const validate = (form) => {
  const errors = {};
  const url = form.url.trim();

  if (!url) {
    errors.url = "Paste a link to shorten.";
  } else {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        errors.url = "Only http and https links can be shortened.";
      }
    } catch {
      errors.url = "Enter a full link that starts with http:// or https://";
    }
  }

  if (form.slug.trim() && !/^[a-zA-Z0-9_-]{3,30}$/.test(form.slug.trim())) {
    errors.slug = "Use 3 to 30 letters, numbers, dashes or underscores.";
  }

  if (form.password && (form.password.length < 4 || form.password.length > 128)) {
    errors.password = "A password needs 4 to 128 characters.";
  }

  const start = form.activeFrom ? new Date(form.activeFrom) : null;
  const end = form.expiresAt ? new Date(form.expiresAt) : null;

  if (end && end <= new Date()) {
    errors.expiresAt = "The end date must be in the future.";
  } else if (start && end && start >= end) {
    errors.expiresAt = "The end date must be after the start date.";
  }

  return errors;
};

const UrlForm = ({ onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const urlInput = useRef(null);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createShortUrl,
    onSuccess: (data) => {
      // A new link changes the dashboard list.
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      onCreated?.(data);
    },
  });

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      if (found.slug || found.password || found.expiresAt) setShowOptions(true);
      if (found.url) urlInput.current?.focus();
      return;
    }

    // Only send the options the person filled in, empty ones mean "not used".
    const body = { url: form.url.trim() };
    if (form.slug.trim()) body.slug = form.slug.trim();
    if (form.password) body.password = form.password;
    if (form.activeFrom) body.activeFrom = fromDateTimeLocal(form.activeFrom);
    if (form.expiresAt) body.expiresAt = fromDateTimeLocal(form.expiresAt);

    create.mutate(body);
  };

  const reset = () => {
    create.reset();
    setForm(emptyForm);
    setErrors({});
    urlInput.current?.focus();
  };

  const optionClass = (name) => `input ${errors[name] ? "border-danger/60" : ""}`;

  return (
    <div className="w-full text-left">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`flex flex-col gap-2 rounded-2xl border bg-surface/80 p-2 transition focus-within:ring-4 sm:flex-row ${
            errors.url
              ? "border-danger/60 focus-within:ring-danger/15"
              : "border-white/12 focus-within:border-brand/60 focus-within:ring-brand/15"
          }`}
          style={{ boxShadow: "0 24px 60px -30px rgba(109,77,242,0.55)" }}
        >
          <div className="relative flex-1">
            <Link2
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-faint"
            />
            <label htmlFor="url" className="sr-only">
              Long URL
            </label>
            <input
              ref={urlInput}
              id="url"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-xl bg-transparent pr-3 pl-11 text-base text-ink outline-none placeholder:text-faint"
              placeholder="Paste your long link here"
              value={form.url}
              onChange={update("url")}
              aria-invalid={Boolean(errors.url)}
              aria-describedby={errors.url ? "url-error" : undefined}
            />
          </div>
          <button type="submit" className="btn-primary h-12 px-6 text-base" disabled={create.isPending}>
            {create.isPending ? (
              <>
                <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                Shortening
              </>
            ) : (
              <>
                Shorten URL
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {errors.url && (
          <p id="url-error" role="alert" className="mt-2 px-1 text-sm text-danger">
            {errors.url}
          </p>
        )}

        <button
          type="button"
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm font-medium text-muted transition hover:text-ink"
          aria-expanded={showOptions}
          aria-controls="advanced-options"
          onClick={() => setShowOptions(!showOptions)}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Advanced options
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`transition-transform ${showOptions ? "rotate-180" : ""}`}
          />
        </button>

        {showOptions && (
          <div
            id="advanced-options"
            className="animate-fade-up mt-3 grid gap-4 rounded-xl border border-white/8 bg-surface/70 p-4 sm:grid-cols-2 sm:p-5"
          >
            <div>
              <label htmlFor="slug" className="label">
                Custom short code
              </label>
              <input
                id="slug"
                className={optionClass("slug")}
                placeholder="my-launch"
                autoComplete="off"
                value={form.slug}
                onChange={update("slug")}
                aria-invalid={Boolean(errors.slug)}
              />
              {errors.slug && <p className="field-error">{errors.slug}</p>}
            </div>
            <div>
              <label htmlFor="link-password" className="label">
                Password
              </label>
              <input
                id="link-password"
                type="password"
                autoComplete="new-password"
                className={optionClass("password")}
                placeholder="Optional, 4 or more characters"
                value={form.password}
                onChange={update("password")}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && <p className="field-error">{errors.password}</p>}
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
                className={optionClass("expiresAt")}
                value={form.expiresAt}
                onChange={update("expiresAt")}
                aria-invalid={Boolean(errors.expiresAt)}
              />
              {errors.expiresAt && <p className="field-error">{errors.expiresAt}</p>}
            </div>
          </div>
        )}

        {create.isError && (
          <p role="alert" className="error-text mt-4">
            {getErrorMessage(create.error)}
          </p>
        )}
      </form>

      {create.isSuccess && (
        <div
          className="animate-fade-up mt-6 rounded-2xl border border-brand/35 bg-surface/90 p-5 sm:p-6"
          style={{ boxShadow: "0 24px 60px -34px rgba(109,77,242,0.7)" }}
          aria-live="polite"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-success">
            <CircleCheck size={16} aria-hidden="true" />
            Your short link is ready
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={create.data.qrCode}
              alt="QR code for the short link"
              width="132"
              height="132"
              className="h-33 w-33 shrink-0 rounded-lg border border-white/10 bg-white p-1.5"
            />
            <div className="min-w-0 flex-1 space-y-4">
              <a
                href={create.data.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="block font-display text-xl font-bold break-all text-ink transition hover:text-brand-text sm:text-2xl"
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
                <button type="button" className="btn-ghost" onClick={reset}>
                  <RotateCcw size={16} aria-hidden="true" />
                  Shorten another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
