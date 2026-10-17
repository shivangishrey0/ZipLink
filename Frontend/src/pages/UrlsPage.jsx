import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import RequireAuth from "../components/RequireAuth.jsx";
import UserUrls from "../components/UserUrls.jsx";

const UrlsPage = () => {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">My links</h1>
          <Link to="/" className="btn-primary">
            <Plus size={16} aria-hidden="true" />
            New link
          </Link>
        </div>
        <UserUrls />
      </div>
    </RequireAuth>
  );
};

export default UrlsPage;
