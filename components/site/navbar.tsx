import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/site/mobile-menu";

const links = [
  { href: "#census", label: "Census" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#council", label: "Council" },
  { href: "#feedback", label: "Feedback" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 animate-fade-down">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group relative z-50 flex items-center gap-3 text-white">
          <Image
            src="/logo.png"
            alt="FUTO crest"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform duration-700 ease-premium group-hover:rotate-[-6deg] group-hover:scale-105"
            priority
          />
          <span className="text-[13px] font-semibold leading-tight sm:text-sm">
            FUTO Biology
            <br />
            <span className="text-gold-500">Alumni Association</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/85 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-1 transition-colors duration-500 ease-premium after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-gold-400 after:transition-transform after:duration-500 after:ease-premium hover:text-gold-400 hover:after:origin-left hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <MobileMenu links={links} />
      </div>
    </header>
  );
}
