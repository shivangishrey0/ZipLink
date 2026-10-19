import { Copy, Zap } from "lucide-react";

// A clearly labelled example. The numbers are the real lengths of the two example strings.
const LONG_URL =
  "https://example.com/blog/2026/how-to-grow-your-audience?utm_source=newsletter&utm_medium=email&utm_campaign=launch";
const CODE = "aB3xK9q";

const LinkTransform = () => {
  const host = typeof window !== "undefined" ? window.location.host : "ziplink";
  const shortUrl = `${host}/${CODE}`;

  return (
    <div
      className="reveal glass rounded-2xl border border-white/10 p-5 text-left sm:p-7"
      role="img"
      aria-label={`Example: a ${LONG_URL.length} character link becomes ${shortUrl}`}
    >
      <p className="text-xs font-medium tracking-wider text-faint uppercase">Example</p>

      <div className="mt-4 grid items-center gap-2 md:grid-cols-[1fr_auto_minmax(0,0.8fr)] md:gap-5">
        <div className="min-w-0 rounded-xl border border-white/8 bg-black/25 px-4 py-3.5">
          <p className="text-xs text-faint">Long link</p>
          <p className="mt-1.5 font-mono text-[13px] leading-relaxed break-all text-muted">{LONG_URL}</p>
        </div>

        <div className="flex h-14 items-center justify-center md:h-auto" aria-hidden="true">
          <div className="relative flex w-14 rotate-90 items-center justify-center md:w-28 md:rotate-0">
            <div
              className="animate-zip-flow h-1.5 w-full rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(124,108,255,0.08), #7c6cff, #3b6cf0, rgba(59,108,240,0.08))",
                backgroundSize: "200% 100%",
              }}
            />
            <span
              className="absolute grid h-8 w-8 -rotate-90 place-items-center rounded-full border border-white/15 text-white md:rotate-0"
              style={{ backgroundImage: "linear-gradient(135deg, #6d4df2, #3b6cf0)" }}
            >
              <Zap size={15} strokeWidth={2.4} />
            </span>
          </div>
        </div>

        <div className="animate-pill-pulse min-w-0 rounded-xl border border-brand/45 bg-brand/10 px-4 py-3.5">
          <p className="text-xs text-brand-text">Short link</p>
          <p className="mt-1.5 flex items-center justify-between gap-3 font-mono text-sm font-semibold text-ink">
            <span className="truncate">{shortUrl}</span>
            <Copy size={14} aria-hidden="true" className="shrink-0 text-brand-text" />
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">
        <span className="font-semibold text-ink">{LONG_URL.length}</span> characters become{" "}
        <span className="font-semibold text-ink">{shortUrl.length}</span>. The short link redirects to
        the original address every time.
      </p>
    </div>
  );
};

export default LinkTransform;
