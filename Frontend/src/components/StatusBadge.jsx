const TONES = {
  ok: "bg-brand-soft text-brand",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

// The status always has a text label, so color is never the only signal.
export const getStatus = (url) => {
  const now = Date.now();

  if (url.activeFrom && new Date(url.activeFrom) > now) {
    return { label: "Not active yet", tone: "warn" };
  }

  if (url.expiresAt && new Date(url.expiresAt) <= now) {
    return { label: "Expired", tone: "danger" };
  }

  return { label: "Active", tone: "ok" };
};

const StatusBadge = ({ url }) => {
  const status = getStatus(url);

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[status.tone]}`}>
      {status.label}
    </span>
  );
};

export default StatusBadge;
