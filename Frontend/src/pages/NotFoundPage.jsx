import { Link } from "@tanstack/react-router";

const NotFoundPage = () => {
  return (
    <div className="mx-auto max-w-md space-y-4 py-12 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="font-display text-2xl font-bold">Page not found</h1>
      <p className="text-muted">That address does not lead anywhere.</p>
      <Link to="/" className="btn-primary">
        Go to ZipLink
      </Link>
    </div>
  );
};

export default NotFoundPage;
