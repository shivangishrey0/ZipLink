import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// compact turns it into a small icon-only button for table rows.
const CopyButton = ({ text, label = "Copy", compact = false, className = "" }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (for example on plain http). The link stays selectable.
    }
  };

  const Icon = copied ? Check : Copy;

  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        className={`grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-white/10 bg-white/5 transition hover:bg-white/10 ${
          copied ? "text-success" : "text-muted hover:text-ink"
        } ${className}`}
        aria-label={copied ? "Copied" : `${label} link`}
        title={copied ? "Copied" : `${label} link`}
      >
        <Icon size={15} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button type="button" className={`btn-ghost ${className}`} onClick={copy}>
      <Icon size={16} aria-hidden="true" className={copied ? "text-success" : ""} />
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
};

export default CopyButton;
