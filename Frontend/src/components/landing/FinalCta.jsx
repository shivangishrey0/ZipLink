import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";

const FinalCta = () => {
  const user = useSelector((state) => state.auth.user);
  const ref = useReveal();

  return (
    <section ref={ref} aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div
          className="reveal relative overflow-hidden rounded-2xl border border-brand/30 px-6 py-14 text-center sm:px-12 sm:py-16"
          style={{
            backgroundImage:
              "radial-gradient(40rem 18rem at 50% 0%, rgba(124,108,255,0.28), transparent 70%), linear-gradient(180deg, rgba(20,27,48,0.9), rgba(14,20,36,0.9))",
            boxShadow: "0 40px 90px -50px rgba(109,77,242,0.8)",
          }}
        >
          <h2
            id="cta-title"
            className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl"
          >
            Your links deserve better.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Start creating cleaner, easier-to-share links today.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={user ? "/urls" : "/register"} className="btn-primary h-12 px-7 text-base">
              {user ? "Open your dashboard" : "Get Started"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {!user && (
              <Link to="/login" className="btn-ghost h-12 px-7 text-base">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
