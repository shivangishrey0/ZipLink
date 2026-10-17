import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";

// The backend redirects visitors here when a short link has a start date that has not come yet.
const LinkNotActive = () => {
  return (
    <div className="mx-auto max-w-md space-y-4 py-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-warn-soft text-warn">
        <CalendarClock aria-hidden="true" />
      </span>
      <h1 className="font-display text-3xl font-bold">This link is not active yet</h1>
      <p className="text-muted">The owner scheduled it to open later. Please check back soon.</p>
      <Link to="/" className="btn-primary">
        Go to ZipLink
      </Link>
    </div>
  );
};

export default LinkNotActive;
