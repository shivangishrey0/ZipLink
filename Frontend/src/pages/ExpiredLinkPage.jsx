import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import StatusCard from "../components/StatusCard.jsx";

// The backend redirects visitors here when a short link is past its expiry date.
const ExpiredLinkPage = () => {
  return (
    <StatusCard
      icon={Clock}
      tone="danger"
      title="This link has expired"
      actions={
        <Link to="/" className="btn-primary">
          Go to ZipLink
        </Link>
      }
    >
      <p>The owner set an end date and it has passed. Ask them for a new link if you still need it.</p>
    </StatusCard>
  );
};

export default ExpiredLinkPage;
