const StatCard = ({ label, value, hint }) => {
  return (
    <div className="card space-y-1">
      <p className="text-sm text-muted">{label}</p>
      {/* A large standalone number uses normal proportional digits, tabular digits are for columns. */}
      <p className="text-3xl font-semibold text-ink">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
};

export default StatCard;
