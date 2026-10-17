import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

// The backend redirects visitors here when a short link is past its expiry date.
const ExpiredLinkPage = () => {
  return (
    <div className="mx-auto max-w-md space-y-4 py-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-danger-soft text-danger">
        <Clock aria-hidden="true" />
      </span>
      <h1 className="font-display text-3xl font-bold">This link has expired</h1>
      <p className="text-muted">
        The owner set an end date and it has passed. Ask them for a new link if you still need it.
      </p>
      <Link to="/" className="btn-primary">
        Go to ZipLink
      </Link>
    </div>
  );
};

export default ExpiredLinkPage;
