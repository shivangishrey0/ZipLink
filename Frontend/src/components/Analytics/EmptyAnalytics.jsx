import { ChartColumn } from "lucide-react";
import CopyButton from "../CopyButton.jsx";

const EmptyAnalytics = ({ shortUrl }) => {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand-text">
        <ChartColumn size={26} aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold tracking-tight">No clicks recorded yet</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        Charts appear after the first visit. Share the link and come back, clicks can take a few
        seconds to show up.
      </p>
      <div className="mt-6">
        <CopyButton text={shortUrl} label="Copy link" />
      </div>
    </div>
  );
};

export default EmptyAnalytics;
