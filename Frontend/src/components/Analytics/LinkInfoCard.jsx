import { formatDate, formatDateTime } from "../../utils/helper.js";
import CopyButton from "../CopyButton.jsx";
import StatusBadge from "../StatusBadge.jsx";

const Row = ({ label, children }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="min-w-0 text-sm text-ink">{children}</dd>
  </div>
);

const LinkInfoCard = ({ link }) => {
  return (
    <dl className="card divide-y divide-line py-2 sm:py-3">
      <Row label="Short link">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all font-medium text-brand hover:underline"
          >
            {link.shortUrl}
          </a>
          <CopyButton text={link.shortUrl} />
        </div>
      </Row>
      <Row label="Destination">
        <a
          href={link.fullUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all hover:underline"
        >
          {link.fullUrl}
        </a>
      </Row>
      <Row label="Status">
        <StatusBadge url={link} />
      </Row>
      <Row label="Created">{formatDate(link.createdAt)}</Row>
      <Row label="Active from">{link.activeFrom ? formatDateTime(link.activeFrom) : "Always"}</Row>
      <Row label="Expires">{link.expiresAt ? formatDateTime(link.expiresAt) : "Never"}</Row>
      <Row label="Password">{link.isProtected ? "Required" : "None"}</Row>
    </dl>
  );
};

export default LinkInfoCard;
