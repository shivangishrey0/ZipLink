const StatCard = ({ label, value, hint, icon: Icon }) => {
  return (
    <div className="card flex flex-col gap-3 !p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand-text">
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
      </div>
      {/* A large standalone number uses normal proportional digits, tabular digits are for columns. */}
      <p className="font-display text-3xl font-extrabold tracking-tight">{value}</p>
      {hint && <p className="text-xs text-faint">{hint}</p>}
    </div>
  );
};

export default StatCard;
