"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MENU_ID = "mobile-menu";

/**
 * Built on the native Popover API: the hamburger opens the menu through the
 * `popovertarget` attribute, so it responds instantly, even before React has
 * hydrated on a slow phone. Escape-to-close comes free from the browser.
 * Styles and the open/close animation live in globals.css (.mobile-menu).
 */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";

  const close = () => {
    const el = ref.current;
    if (!el) return;
    if (supportsPopover()) el.hidePopover();
    else delete el.dataset.open;
  };

  // Fallback for browsers without popover support (pre-iOS 17): toggle a data attribute instead.
  const fallbackToggle = () => {
    const el = ref.current;
    if (!el || supportsPopover()) return;
    if (el.dataset.open) delete el.dataset.open;
    else el.dataset.open = "";
  };

  // Close the menu if the screen grows to desktop width while it's open.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onChange = () => desktop.matches && close();
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        popoverTarget={MENU_ID}
        popoverTargetAction="show"
        onClick={fallbackToggle}
        aria-label="Open menu"
        className="relative z-50 -mr-2 flex h-11 w-11 animate-fade-down items-center justify-center rounded-lg text-white transition-colors duration-500 ease-premium hover:bg-white/10 md:hidden"
      >
        <span aria-hidden className="flex w-6 flex-col gap-1.5">
          <span className="h-0.5 w-6 rounded-full bg-current" />
          <span className="h-0.5 w-4 rounded-full bg-current" />
          <span className="h-0.5 w-6 rounded-full bg-current" />
        </span>
      </button>

      <div ref={ref} id={MENU_ID} popover="auto" aria-label="Site menu" className="mobile-menu dna-bg">
        {/* Mirrors the page header so the X lands exactly where the hamburger was. */}
        <div className="flex items-center justify-between px-5 py-4">
          <a href="#" onClick={close} className="flex items-center gap-3">
            <Image src="/logo.png" alt="FUTO crest" width={44} height={44} className="h-11 w-11 object-contain" />
            <span className="text-[13px] font-semibold leading-tight">
              FUTO Biology
              <br />
              <span className="text-gold-500">Alumni Association</span>
            </span>
          </a>
          <button
            type="button"
            popoverTarget={MENU_ID}
            popoverTargetAction="hide"
            onClick={fallbackToggle}
            aria-label="Close menu"
            className="mobile-menu-close -mr-2 flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-500 ease-premium hover:bg-white/10"
          >
            <X className="h-7 w-7" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-col px-5 pt-8">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="mobile-menu-item group flex items-baseline gap-4 border-b border-white/10 py-5"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="font-display text-sm text-gold-500/70">0{i + 1}</span>
              <span className="font-display text-3xl font-bold transition-colors duration-500 ease-premium group-hover:text-gold-400">
                {l.label}
              </span>
            </a>
          ))}
        </nav>

        <div
          className="mobile-menu-item mt-auto flex flex-col gap-3 px-5 pb-10 pt-10"
          style={{ "--i": links.length } as React.CSSProperties}
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
        </div>
      </div>
    </>
  );
}

function supportsPopover() {
  return typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
}
