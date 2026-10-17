import { Link, useParams } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { getAnalytics } from "../api/ShortUrl.api.jsx";
import { formatDate, getErrorMessage } from "../utils/helper.js";
import RequireAuth from "../components/RequireAuth.jsx";
import StatCard from "../components/Analytics/StatCard.jsx";
import DailyClicksChart from "../components/Analytics/DailyClicksChart.jsx";
import DeviceBreakdownChart from "../components/Analytics/DeviceBreakdownChart.jsx";
import EmptyAnalytics from "../components/Analytics/EmptyAnalytics.jsx";
import LinkInfoCard from "../components/Analytics/LinkInfoCard.jsx";

const AnalyticsContent = ({ code }) => {
  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["analytics", code],
    queryFn: () => getAnalytics(code),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-16 text-muted" role="status" aria-label="Loading analytics">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="error-text">
        {getErrorMessage(error)}
      </p>
    );
  }

  const { link, totalClicks, daily, devices } = data;
  const last30 = daily.reduce((sum, day) => sum + day.clicks, 0);
  const busiest = daily.reduce((best, day) => (day.clicks > best.clicks ? day : best), daily[0]);
  const hasDetails = devices.length > 0;

  return (
    <div className={`space-y-6 ${isPlaceholderData ? "opacity-60" : ""}`}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total clicks" value={totalClicks} hint="All time" />
        <StatCard label="Last 30 days" value={last30} hint="UTC days" />
        <StatCard
          label="Busiest day"
          value={busiest.clicks > 0 ? busiest.clicks : "-"}
          hint={busiest.clicks > 0 ? formatDate(`${busiest.date}T00:00:00Z`) : "No clicks in this period"}
        />
      </div>

      {hasDetails ? (
        <>
          <section className="card space-y-4" aria-labelledby="daily-title">
            <div>
              <h2 id="daily-title" className="font-display text-lg font-semibold">
                Clicks per day
              </h2>
              <p className="text-sm text-muted">Last 30 days</p>
            </div>
            <DailyClicksChart data={daily} />
          </section>

          <section className="card space-y-4" aria-labelledby="device-title">
            <div>
              <h2 id="device-title" className="font-display text-lg font-semibold">
                Devices
              </h2>
              <p className="text-sm text-muted">Clicks by device type, all time</p>
            </div>
            <DeviceBreakdownChart devices={devices} />
          </section>
        </>
      ) : (
        <EmptyAnalytics shortUrl={link.shortUrl} />
      )}

      <section aria-labelledby="info-title" className="space-y-3">
        <h2 id="info-title" className="font-display text-lg font-semibold">
          Link details
        </h2>
        <LinkInfoCard link={link} />
      </section>
    </div>
  );
};

const AnalyticsPage = () => {
  const { code } = useParams({ strict: false });

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="space-y-2">
          <Link to="/urls" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
            <ArrowLeft size={16} aria-hidden="true" />
            My links
          </Link>
          <h1 className="font-display text-3xl font-bold">Analytics</h1>
        </div>
        <AnalyticsContent code={code} />
      </div>
    </RequireAuth>
  );
};

export default AnalyticsPage;
