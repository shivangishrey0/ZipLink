import CopyButton from "../CopyButton.jsx";

const EmptyAnalytics = ({ shortUrl }) => {
  return (
    <div className="card space-y-3 py-10 text-center">
      <p className="font-display text-xl font-semibold">No clicks recorded yet</p>
      <p className="mx-auto max-w-md text-sm text-muted">
        Charts appear after the first visit. Share the link and come back.
      </p>
      <div>
        <CopyButton text={shortUrl} label="Copy link" />
      </div>
    </div>
  );
};

export default EmptyAnalytics;
