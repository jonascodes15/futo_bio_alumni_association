import { MessageCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";

// Headline words rise in one after another; `gold` marks the highlighted words.
const headline = [
  { w: "Reconnecting" },
  { w: "FUTO", gold: true },
  { w: "Bioscientists", gold: true },
  { w: "Across" },
  { w: "the" },
  { w: "Globe" },
];

// Plain CSS keyframes (not JS) so the hero animates on first paint,
// even before the page has hydrated on a slow connection.
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";
  return (
    <section className="dna-bg relative overflow-hidden pb-28 pt-36 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] -top-[20%] h-[60vmax] w-[60vmax] animate-drift rounded-full bg-forest-500/20 blur-3xl" />
        <div className="absolute -bottom-[30%] -right-[15%] h-[55vmax] w-[55vmax] animate-drift-slow rounded-full bg-gold-500/10 blur-3xl" />
        <div
          className="absolute inset-0 animate-fade-in opacity-[0.07] [animation-duration:2s]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <p
          className="mb-5 inline-block animate-rise rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400"
          style={delay(100)}
        >
          The First Alumni Association · Dept. of Biology
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
          {headline.map(({ w, gold }, i) => (
            <span key={w}>
              <span className={`inline-block animate-rise ${gold ? "text-gold-500" : ""}`} style={delay(220 + i * 70)}>
                {w}
              </span>
              {i < headline.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-rise text-lg text-white/80" style={delay(700)}>
          Official Portal of the FUTO Department of Biology Alumni Association.
        </p>
        <div
          className="mt-10 flex animate-rise flex-col items-center justify-center gap-4 sm:flex-row"
          style={delay(840)}
        >
          <Magnetic>
            <Button asChild variant="gold" size="lg" className="group">
              <a href="#census">
                Join the Global Census
                <ArrowDown className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-y-0.5" />
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline" size="lg">
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Join Official WhatsApp Community
              </a>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
