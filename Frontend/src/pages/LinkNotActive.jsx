import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import StatusCard from "../components/StatusCard.jsx";

// The backend redirects visitors here when a short link has a start date that has not come yet.
const LinkNotActive = () => {
  return (
    <StatusCard
      icon={CalendarClock}
      tone="warn"
      title="This link is not active yet"
      actions={
        <Link to="/" className="btn-primary">
          Go to ZipLink
        </Link>
      }
    >
      <p>The owner scheduled it to open later. Please check back soon.</p>
    </StatusCard>
  );
};

export default LinkNotActive;
