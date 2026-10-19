import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChartColumn, Lock, QrCode } from "lucide-react";
import Logo from "../Logo.jsx";

// What the account gives you. Each line is something the app really does.
const PERKS = [
  { icon: QrCode, title: "QR code for every link", text: "Download it the moment a link is created." },
  { icon: Lock, title: "Passwords and schedules", text: "Protect a link, or set when it opens and closes." },
  { icon: ChartColumn, title: "Click analytics", text: "Daily clicks and device types for each link." },
];

// Split screen: the form on the left, a quiet animated panel on the right (hidden on small screens).
const AuthLayout = ({ children }) => {
  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-7 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="ZipLink home">
            <Logo />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div className="animate-fade-up mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </div>

      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden border-l border-white/8 lg:flex lg:items-center lg:justify-center"
        style={{
          backgroundImage:
            "radial-gradient(46rem 30rem at 20% 10%, rgba(124,108,255,0.30), transparent 62%), radial-gradient(36rem 28rem at 90% 90%, rgba(59,108,240,0.24), transparent 62%), linear-gradient(160deg, #10162d 0%, #0a0e1b 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 75%)",
          }}
        />
        <div
          className="animate-drift-a absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle, rgba(124,108,255,0.26), transparent 66%)" }}
        />
        <div
          className="animate-drift-b absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle, rgba(59,108,240,0.2), transparent 66%)" }}
        />

        <div className="relative w-full max-w-md px-10">
          <h2 className="font-display text-4xl leading-tight font-extrabold tracking-tight text-balance">
            Short links, <span className="gradient-text">full control.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Create links in seconds and manage every one of them from a single dashboard.
          </p>

          <ul className="mt-10 space-y-4">
            {PERKS.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className={`glass flex items-start gap-4 rounded-xl border border-white/10 p-4 ${
                  index % 2 === 0 ? "animate-float" : "animate-float-slow"
                }`}
                style={{ marginLeft: index === 1 ? "1.5rem" : 0, animationDelay: `${index * 0.6}s` }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/15 text-brand-text">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
