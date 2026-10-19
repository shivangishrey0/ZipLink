import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Clock, Link2, MousePointerClick } from "lucide-react";
import { getUserUrls } from "../../api/ShortUrl.api.jsx";
import { timeAgo } from "../../utils/helper.js";
import { getStatus } from "../StatusBadge.jsx";

const SUMMARY_LIMIT = 50; // the most links one request returns

const Card = ({ icon: Icon, label, value, hint, loading, className = "" }) => (
  <div className={`card flex flex-col gap-3 !p-4 sm:!p-5 ${className}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted">{label}</p>
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand-text">
        <Icon size={17} aria-hidden="true" />
      </span>
    </div>
    {loading ? (
      <div className="h-8 w-20 rounded-md bg-white/10 motion-safe:animate-pulse" aria-hidden="true" />
    ) : (
      <p className="truncate font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
    )}
    <p className="truncate text-xs text-faint">{loading ? " " : hint}</p>
  </div>
);

// Every number comes from the links the API returns. Nothing here is invented.
const OverviewCards = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["urls", "summary"],
    queryFn: () => getUserUrls({ page: 1, limit: SUMMARY_LIMIT }),
  });

  if (isError) return null;

  const urls = data?.urls ?? [];
  const total = data?.total ?? 0;
  // Totals and click counts are exact until there are more links than one request returns.
  const partial = total > urls.length;
  const scope = partial ? `Across your newest ${urls.length} links` : "All time";
  const clicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const active = urls.filter((url) => getStatus(url).tone === "ok").length;
  const latest = urls[0];

  return (
    <section aria-label="Overview" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <Card icon={Link2} label="Total links" value={total} hint="Created with your account" loading={isPending} />
      <Card icon={MousePointerClick} label="Total clicks" value={clicks} hint={scope} loading={isPending} />
      <Card
        icon={BadgeCheck}
        label="Active links"
        value={active}
        hint={partial ? scope : "Currently redirecting"}
        loading={isPending}
      />
      <Card
        icon={Clock}
        label="Latest link"
        value={latest ? latest.shortCode : "None yet"}
        hint={latest ? `Created ${timeAgo(latest.createdAt)}` : "Create your first link"}
        loading={isPending}
        className="col-span-2 xl:col-span-1"
      />
    </section>
  );
};

export default OverviewCards;
