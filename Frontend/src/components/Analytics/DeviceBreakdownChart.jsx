const LABELS = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };

// Three nominal categories, so horizontal bars: length carries the value and every bar has the
// same single color (a color ramp would only repeat what the length already says).
// Bars are square at the baseline, 4px rounded at the data end, and 16px thick.
const DeviceBreakdownChart = ({ devices }) => {
  const total = devices.reduce((sum, d) => sum + d.clicks, 0);
  const max = Math.max(...devices.map((d) => d.clicks));

  return (
    <div className="space-y-3">
      <ul className="space-y-4" aria-label="Clicks by device type">
        {devices.map((d) => {
          const share = Math.round((d.clicks / total) * 100);

          return (
            <li key={d.device} className="space-y-1.5">
              <p className="text-sm font-medium text-ink">{LABELS[d.device] ?? d.device}</p>
              {/* The bar gets the width left after the value label, so the value always sits at its tip. */}
              <div className="flex items-center gap-3">
                <div
                  className="h-4 min-w-1 rounded-r-[4px] bg-chart transition hover:brightness-110"
                  style={{ width: `calc((100% - 7rem) * ${d.clicks / max})` }}
                  title={`${LABELS[d.device] ?? d.device}: ${d.clicks} clicks (${share}%)`}
                />
                <p className="shrink-0 text-sm">
                  <span className="font-semibold text-ink">{d.clicks}</span>{" "}
                  <span className="text-muted">({share}%)</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-ink">View as a table</summary>
        <div className="mt-2 overflow-auto rounded-lg border border-line">
          <table className="w-full text-left">
            <thead className="text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Device</th>
                <th className="px-3 py-2 text-right font-medium">Clicks</th>
                <th className="px-3 py-2 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.device} className="border-t border-line">
                  <td className="px-3 py-1.5">{LABELS[d.device] ?? d.device}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{d.clicks}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {Math.round((d.clicks / total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default DeviceBreakdownChart;
