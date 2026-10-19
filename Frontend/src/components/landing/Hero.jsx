import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";
import UrlForm from "../UrlForm.jsx";
import LinkTransform from "./LinkTransform.jsx";

const Hero = () => {
  const user = useSelector((state) => state.auth.user);
  const ref = useReveal();

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative">
      <div className="container-page flex flex-col items-center pt-14 pb-16 text-center sm:pt-24 sm:pb-24">
        <span className="eyebrow animate-fade-up">
          <Sparkles size={14} aria-hidden="true" />
          Short links, QR codes and click analytics
        </span>

        <h1
          id="hero-title"
          className="animate-fade-up mt-7 max-w-4xl font-display text-[2.6rem] leading-[1.04] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Shorten Links.
          <br />
          <span className="gradient-text">Amplify Your Reach.</span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Transform long, complicated URLs into clean, shareable links. Create short links in seconds
          and manage them effortlessly from one powerful dashboard.
        </p>

        <div
          className="animate-fade-up mt-10 w-full max-w-3xl"
          style={{ animationDelay: "240ms" }}
        >
          <UrlForm />
        </div>

        <p className="mt-5 text-sm text-faint">
          No account needed to shorten a link.{" "}
          {user ? (
            <Link to="/urls" className="font-medium text-brand-text hover:underline">
              Open your dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="font-medium text-brand-text hover:underline">
                Log in
              </Link>{" "}
              to edit links and see their analytics.
            </>
          )}
        </p>

        <div className="mt-16 w-full max-w-4xl">
          <LinkTransform />
        </div>
      </div>
    </section>
  );
};

export default Hero;
