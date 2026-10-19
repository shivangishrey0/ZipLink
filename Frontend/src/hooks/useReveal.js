import { useEffect, useRef } from "react";

// Fades elements with the "reveal" class in once they scroll into view.
// Without IntersectionObserver, or when the visitor prefers reduced motion, everything shows at once.
export const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const nodes = [...root.querySelectorAll(".reveal")];
    if (root.classList.contains("reveal")) nodes.push(root);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return ref;
};
