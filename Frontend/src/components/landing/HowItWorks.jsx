import { useReveal } from "../../hooks/useReveal.js";

const STEPS = [
  {
    title: "Paste your long URL",
    text: "Drop any http or https link into the box. Add a custom code, a password or dates if you need them.",
  },
  {
    title: "Generate your short link",
    text: "ZipLink creates a short address and a QR code for it in a moment.",
  },
  {
    title: "Copy, share, and manage",
    text: "Copy the link, share it anywhere, then edit it or check its clicks from your dashboard.",
  },
];

const HowItWorks = () => {
  const ref = useReveal();

  return (
    <section
      id="how-it-works"
      ref={ref}
      aria-labelledby="how-title"
      className="border-y border-white/6 bg-bg-2/50 py-20 sm:py-28"
    >
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wider text-brand-text uppercase">How it works</p>
          <h2
            id="how-title"
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            From long link to shared in three steps
          </h2>
        </div>

        <ol className="mx-auto mt-16 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative flex gap-5 md:block md:text-center"
              style={{ "--reveal-delay": `${index * 120}ms` }}
            >
              {/* connecting line: vertical on phones, horizontal between the circles from md up */}
              {index < STEPS.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute top-14 -bottom-10 left-6 w-px bg-gradient-to-b from-brand/60 to-transparent md:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-6 left-[calc(50%+2.25rem)] hidden h-px w-[calc(100%-4.5rem+1.5rem)] bg-gradient-to-r from-brand/60 to-brand/10 md:block"
                  />
                </>
              )}

              <span
                className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brand/40 font-display text-lg font-extrabold text-white md:mx-auto"
                style={{
                  backgroundImage: "linear-gradient(135deg, #6d4df2, #3b6cf0)",
                  boxShadow: "0 0 0 6px rgba(124,108,255,0.12), 0 12px 30px -10px rgba(109,77,242,0.8)",
                }}
              >
                {index + 1}
              </span>

              <div className="md:mt-6">
                <h3 className="font-display text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
