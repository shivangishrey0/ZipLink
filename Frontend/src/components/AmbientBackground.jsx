// Fixed, decorative background: a violet glow at the top, a faint grid that fades out, and two soft
// lights that drift very slowly. It sits behind everything and never takes clicks.
const AmbientBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(62rem 38rem at 50% -8%, rgba(124,108,255,0.20), transparent 62%), radial-gradient(40rem 30rem at 100% 38%, rgba(59,130,246,0.08), transparent 60%)",
        }}
      />
      <div
        className="animate-drift-a absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(124,108,255,0.16), transparent 66%)" }}
      />
      <div
        className="animate-drift-b absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 66%)" }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 25%, transparent 78%)",
        }}
      />
    </div>
  );
};

export default AmbientBackground;
