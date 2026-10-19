import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import Logo from "./Logo.jsx";

// Only links that exist inside the app. No invented social accounts or contact details.
const Footer = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const goToSection = (event, id) => {
    event.preventDefault();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
      window.history.replaceState(null, "", `/#${id}`);
    } else {
      navigate({ to: "/", hash: id });
    }
  };

  const link = "text-sm text-muted transition hover:text-ink";

  return (
    <footer className="relative z-10 border-t border-white/8 bg-bg-2/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted">
            Turn long links into short ones, add a QR code, protect or schedule them, and see how
            they perform.
          </p>
        </div>

        <nav aria-label="Product" className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-faint uppercase">Product</p>
          <ul className="space-y-2.5">
            <li>
              <a href="/#features" onClick={(event) => goToSection(event, "features")} className={link}>
                Features
              </a>
            </li>
            <li>
              <a
                href="/#how-it-works"
                onClick={(event) => goToSection(event, "how-it-works")}
                className={link}
              >
                How it works
              </a>
            </li>
            <li>
              <Link to={user ? "/urls" : "/login"} className={link}>
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Account" className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-faint uppercase">Account</p>
          <ul className="space-y-2.5">
            {user ? (
              <li>
                <Link to="/urls" className={link}>
                  My links
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className={link}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={link}>
                    Create an account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/8">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ZipLink. All rights reserved.</p>
          <p>Built with React, Express and MongoDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
