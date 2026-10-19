import { Link, useParams } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, ExternalLink, MousePointerClick, TrendingUp } from "lucide-react";
import { getAnalytics } from "../api/ShortUrl.api.jsx";
import { formatDate, getErrorMessage } from "../utils/helper.js";
import CopyButton from "../components/CopyButton.jsx";
import StatCard from "../components/Analytics/StatCard.jsx";
import DailyClicksChart from "../components/Analytics/DailyClicksChart.jsx";
import DeviceBreakdownChart from "../components/Analytics/DeviceBreakdownChart.jsx";
import EmptyAnalytics from "../components/Analytics/EmptyAnalytics.jsx";
import LinkInfoCard from "../components/Analytics/LinkInfoCard.jsx";

const Skeleton = () => (
  <div className="space-y-6" role="status" aria-label="Loading analytics">
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((n) => (
        <div key={n} className="card h-32 motion-safe:animate-pulse" />
      ))}
    </div>
    <div className="card h-80 motion-safe:animate-pulse" />
  </div>
);

// Rendered inside DashboardLayout, which already makes sure someone is logged in.
const AnalyticsPage = () => {
  const { code } = useParams({ strict: false });

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["analytics", code],
    queryFn: () => getAnalytics(code),
    placeholderData: keepPreviousData,
  });

  const link = data?.link;
  const last30 = data ? data.daily.reduce((sum, day) => sum + day.clicks, 0) : 0;
  const busiest = data ? data.daily.reduce((best, day) => (day.clicks > best.clicks ? day : best), data.daily[0]) : null;
  const hasDetails = data ? data.devices.length > 0 : false;

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/urls"
          className="inline-flex items-center gap-1.5 rounded-md py-1 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to dashboard
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Analytics</h1>
            <p className="mt-1.5 truncate font-mono text-sm text-brand-text">
              {link ? link.shortUrl.replace(/^https?:\/\//, "") : code}
            </p>
          </div>
          {link && (
            <div className="flex gap-2">
              <CopyButton text={link.shortUrl} label="Copy link" />
              <a href={link.shortUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <ExternalLink size={16} aria-hidden="true" />
                Open
              </a>
            </div>
          )}
        </div>
      </div>

      {isPending && <Skeleton />}

      {isError && (
        <div className="card space-y-4">
          <p role="alert" className="error-text">
            {getErrorMessage(error)}
          </p>
          <Link to="/urls" className="btn-ghost">
            Back to dashboard
          </Link>
        </div>
      )}

      {data && (
        <div className={`space-y-6 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={MousePointerClick} label="Total clicks" value={data.totalClicks} hint="All time" />
            <StatCard icon={CalendarDays} label="Last 30 days" value={last30} hint="Counted in UTC days" />
            <StatCard
              icon={TrendingUp}
              label="Busiest day"
              value={busiest.clicks > 0 ? busiest.clicks : "-"}
              hint={busiest.clicks > 0 ? formatDate(`${busiest.date}T00:00:00Z`) : "No clicks in this period"}
            />
          </div>

          {hasDetails ? (
            <>
              <section className="card space-y-5" aria-labelledby="daily-title">
                <div>
                  <h2 id="daily-title" className="font-display text-lg font-bold tracking-tight">
                    Clicks per day
                  </h2>
                  <p className="text-sm text-muted">Last 30 days</p>
                </div>
                <DailyClicksChart data={data.daily} />
              </section>

              <section className="card space-y-5" aria-labelledby="device-title">
                <div>
                  <h2 id="device-title" className="font-display text-lg font-bold tracking-tight">
                    Devices
                  </h2>
                  <p className="text-sm text-muted">Clicks by device type, all time</p>
                </div>
                <DeviceBreakdownChart devices={data.devices} />
              </section>
            </>
          ) : (
            <EmptyAnalytics shortUrl={link.shortUrl} />
          )}

          <section aria-labelledby="info-title" className="space-y-3">
            <h2 id="info-title" className="font-display text-lg font-bold tracking-tight">
              Link details
            </h2>
            <LinkInfoCard link={link} />
          </section>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
