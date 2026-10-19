const TONES = {
  brand: {
    box: "border-brand/35 bg-brand/12 text-brand-text",
    glow: "0 0 60px -10px rgba(124,108,255,0.55)",
  },
  warn: {
    box: "border-warn/35 bg-warn-soft text-warn",
    glow: "0 0 60px -10px rgba(251,191,36,0.4)",
  },
  danger: {
    box: "border-danger/35 bg-danger-soft text-danger",
    glow: "0 0 60px -10px rgba(251,113,133,0.45)",
  },
};

// The shared look of the one-message pages: locked, expired, not active yet, not found.
const StatusCard = ({ icon: Icon, tone = "brand", title, children, actions }) => {
  const style = TONES[tone];

  return (
    <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center py-12 text-center sm:py-20">
      <span
        className={`grid h-16 w-16 place-items-center rounded-2xl border ${style.box}`}
        style={{ boxShadow: style.glow }}
      >
        <Icon size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-7 font-display text-3xl font-extrabold tracking-tight text-balance">{title}</h1>
      <div className="mt-3 text-base leading-relaxed text-muted">{children}</div>
      {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
};

export default StatusCard;
