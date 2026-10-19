import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import Hero from "../components/landing/Hero.jsx";
import Features from "../components/landing/Features.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import FinalCta from "../components/landing/FinalCta.jsx";

const HomePage = () => {
  const hash = useRouterState({ select: (state) => state.location.hash });

  // Arriving from another page with #features or #how-it-works: scroll to that section.
  useEffect(() => {
    const id = (hash ?? "").replace(/^#/, "");
    if (!id) return undefined;

    const timer = setTimeout(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 60);

    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <FinalCta />
    </>
  );
};

export default HomePage;
