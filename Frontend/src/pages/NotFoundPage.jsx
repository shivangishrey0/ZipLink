import { Link } from "@tanstack/react-router";

const NotFoundPage = () => {
  return (
    <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center py-12 text-center sm:py-20">
      <p className="gradient-text font-display text-8xl leading-none font-extrabold tracking-tight">404</p>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        That address does not lead anywhere. The link may be mistyped or may have been removed.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Go to ZipLink
      </Link>
    </div>
  );
};

export default NotFoundPage;
