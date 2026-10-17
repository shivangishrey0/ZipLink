import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// The backend sends UTC days like "2026-10-17", so format them as UTC too or they shift by a day.
const formatDay = (iso, options) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { timeZone: "UTC", ...options });

const shortDay = (iso) => formatDay(iso, { month: "short", day: "numeric" });
const longDay = (iso) => formatDay(iso, { weekday: "short", month: "short", day: "numeric", year: "numeric" });

const compact = (n) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}K` : String(n));

const AXIS_TEXT = { fill: "var(--muted)", fontSize: 12 };

// One tooltip for the hovered day. The value leads, the label follows, and a short line keys the series.
const DayTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { date, clicks } = payload[0].payload;

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-sm">
      <p className="text-xs text-muted">{longDay(date)}</p>
      <p className="mt-0.5 flex items-center gap-2">
        <span aria-hidden="true" className="h-0.5 w-3 rounded bg-chart" />
        <span className="font-semibold text-ink">{clicks}</span>
        <span className="text-muted">{clicks === 1 ? "click" : "clicks"}</span>
      </p>
    </div>
  );
};

const DailyClicksChart = ({ data }) => {
  const last = data[data.length - 1];
  // Label every 7th day counting back from today, so the newest day always has a tick.
  const ticks = data.filter((_, i) => (data.length - 1 - i) % 7 === 0).map((d) => d.date);
  const total = data.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div className="space-y-3">
      <div
        className="h-72 w-full"
        role="img"
        aria-label={`Clicks per day over the last ${data.length} days: ${total} in total, ${last.clicks} today.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 28, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis
              dataKey="date"
              ticks={ticks}
              interval={0}
              tickFormatter={shortDay}
              tickLine={false}
              axisLine={{ stroke: "var(--line)" }}
              tick={AXIS_TEXT}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, (max) => Math.max(max, 4)]}
              tickFormatter={compact}
              tickLine={false}
              axisLine={false}
              tick={AXIS_TEXT}
              width={36}
            />
            <Tooltip content={<DayTooltip />} cursor={{ stroke: "var(--muted)", strokeWidth: 1 }} />
            <Area
              type="linear"
              dataKey="clicks"
              stroke="var(--chart)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="var(--chart)"
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart)", stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            {/* The one direct label: today's value at the end of the line. */}
            <ReferenceDot
              x={last.date}
              y={last.clicks}
              r={4}
              fill="var(--chart)"
              stroke="var(--surface)"
              strokeWidth={2}
              ifOverflow="visible"
              label={{ value: last.clicks, position: "top", fill: "var(--ink)", fontSize: 12, fontWeight: 600 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-ink">View as a table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-surface text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Day (UTC)</th>
                <th className="px-3 py-2 text-right font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((row) => (
                <tr key={row.date} className="border-t border-line">
                  <td className="px-3 py-1.5">{longDay(row.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{row.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default DailyClicksChart;
