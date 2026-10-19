const TONES = {
  ok: "border-success/25 bg-success-soft text-success",
  warn: "border-warn/25 bg-warn-soft text-warn",
  danger: "border-danger/25 bg-danger-soft text-danger",
};

// The status always has a text label, so color is never the only signal.
export const getStatus = (url) => {
  const now = Date.now();

  if (url.activeFrom && new Date(url.activeFrom) > now) {
    return { label: "Scheduled", tone: "warn" };
  }

  if (url.expiresAt && new Date(url.expiresAt) <= now) {
    return { label: "Expired", tone: "danger" };
  }

  return { label: "Active", tone: "ok" };
};

const StatusBadge = ({ url }) => {
  const status = getStatus(url);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[status.tone]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
};

export default StatusBadge;
