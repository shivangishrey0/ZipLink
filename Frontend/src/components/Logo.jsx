import { Zap } from "lucide-react";

// Text logo with a small mark. "Zip" is plain, "Link" carries the brand gradient.
const Logo = ({ size = "md" }) => {
  const box = size === "lg" ? "h-9 w-9" : "h-8 w-8";
  const text = size === "lg" ? "text-2xl" : "text-xl";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${box} grid place-items-center rounded-lg text-white`}
        style={{
          backgroundImage: "linear-gradient(135deg, #6d4df2 0%, #3b6cf0 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), 0 8px 20px -8px rgba(109,77,242,0.8)",
        }}
      >
        <Zap size={size === "lg" ? 20 : 18} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className={`font-display ${text} font-extrabold tracking-tight text-ink`}>
        Zip<span className="gradient-text">Link</span>
      </span>
    </span>
  );
};

export default Logo;
