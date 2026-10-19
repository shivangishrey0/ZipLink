import { ChartColumn, LayoutDashboard, QrCode, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";

// Every card describes something the app really does.
const FEATURES = [
  {
    icon: Zap,
    title: "Instant URL Shortening",
    text: "Paste a link and get a short one in a moment. Pick your own short code if you want an address people can remember.",
  },
  {
    icon: QrCode,
    title: "Easy Copy and Share",
    text: "Copy the new link in one click and download a QR code that points to it, ready for print or screens.",
  },
  {
    icon: LayoutDashboard,
    title: "Personal Link Dashboard",
    text: "Every link you create while logged in lives in one place, with its status, click count and creation date.",
  },
  {
    icon: ShieldCheck,
    title: "Secure User Authentication",
    text: "Sign up with email or continue with Google. Passwords are hashed with Argon2 and sessions use HTTP-only cookies.",
  },
  {
    icon: SlidersHorizontal,
    title: "Full Link Management",
    text: "Change a destination, set start and end dates, protect a link with a password, or delete it when you are done.",
  },
  {
    icon: ChartColumn,
    title: "Click Analytics",
    text: "See total clicks, a daily chart for the last 30 days, and how many visitors used desktop, mobile or tablet.",
  },
];

const Features = () => {
  const ref = useReveal();

  return (
    <section id="features" ref={ref} aria-labelledby="features-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wider text-brand-text uppercase">Features</p>
          <h2
            id="features-title"
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Everything you need to manage your links
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Short links are the start. Protect them, schedule them, share them and see how they perform.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="reveal card card-hover group"
              style={{ "--reveal-delay": `${(index % 3) * 90}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand-text transition duration-300 group-hover:scale-110 group-hover:border-brand/50 group-hover:bg-brand/20">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
