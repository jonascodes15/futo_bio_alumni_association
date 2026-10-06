import { MessageCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";
  return (
    <section className="dna-bg relative overflow-hidden pb-28 pt-36 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <p className="mb-5 inline-block rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          The First Alumni Association · Dept. of Biology
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
          Reconnecting <span className="text-gold-500">FUTO Bioscientists</span> Across the Globe
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          Official Portal of the FUTO Department of Biology Alumni Association.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <a href="#census">
              Join the Global Census <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Join Official WhatsApp Community
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
