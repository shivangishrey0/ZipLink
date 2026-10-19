import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useDashboard } from "../components/dashboard/DashboardLayout.jsx";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import UserUrls from "../components/UserUrls.jsx";

// Rendered inside DashboardLayout, which already makes sure someone is logged in.
const UrlsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { openCreate } = useDashboard();
  const firstName = (user?.name ?? "").trim().split(/\s+/)[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1.5 text-muted">
            Welcome back{firstName ? `, ${firstName}` : ""}. Create, share and manage your short links.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus size={17} aria-hidden="true" />
          Create link
        </button>
      </div>

      <OverviewCards />

      <section aria-labelledby="links-title" className="space-y-4">
        <h2 id="links-title" className="font-display text-xl font-bold tracking-tight">
          Your links
        </h2>
        <UserUrls />
      </section>
    </div>
  );
};

export default UrlsPage;
