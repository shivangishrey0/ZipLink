import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import UrlForm from "../components/UrlForm.jsx";

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Short links that stay yours</h1>
        <p className="text-muted">
          Shorten a URL, protect it with a password, set when it opens and closes, and see who
          clicks.
        </p>
      </div>

      <UrlForm />

      {!user && (
        <p className="text-center text-sm text-muted">
          <Link to="/login" className="font-medium text-brand hover:underline">
            Log in
          </Link>{" "}
          to keep your links, edit them later and see their analytics.
        </p>
      )}
    </div>
  );
};

export default HomePage;
