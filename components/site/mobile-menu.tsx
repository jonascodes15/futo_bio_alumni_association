"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, stagger } from "motion/react";
import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_PREMIUM } from "@/components/motion/reveal";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";

  // While open: lock page scroll, close on Escape, and close if the screen grows to desktop width.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="relative z-50 -mr-2 flex h-11 w-11 animate-fade-down items-center justify-center rounded-lg text-white transition-colors duration-500 ease-premium hover:bg-white/10 md:hidden"
      >
        {/* Three bars that fold into an X. */}
        <span aria-hidden className="relative block h-4 w-6">
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition-transform duration-500 ease-premium ${
              open ? "translate-y-1.75 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1.75 h-0.5 rounded-full bg-current transition-[opacity,width] duration-300 ease-premium ${
              open ? "w-0 opacity-0" : "w-4 opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-3.5 h-0.5 w-6 rounded-full bg-current transition-transform duration-500 ease-premium ${
              open ? "-translate-y-1.75 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="dna-bg fixed inset-0 z-40 flex flex-col overflow-y-auto px-5 pb-10 pt-28 md:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { delayChildren: stagger(0.06, { startDelay: 0.08 }) } } }}
              className="flex flex-col"
            >
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
                  }}
                  className="group flex items-baseline gap-4 border-b border-white/10 py-5 text-white"
                >
                  <span className="font-display text-sm text-gold-500/70">0{i + 1}</span>
                  <span className="font-display text-3xl font-bold transition-colors duration-500 ease-premium group-hover:text-gold-400">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.35 }}
              className="mt-auto flex flex-col gap-3 pt-10"
            >
              <Button asChild variant="gold" size="lg">
                <a href="#census" onClick={close}>
                  Join the Global Census <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={wa} target="_blank" rel="noopener noreferrer" onClick={close}>
                  <MessageCircle className="h-4 w-4" /> Join WhatsApp Community
                </a>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
