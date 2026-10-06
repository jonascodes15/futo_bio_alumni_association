import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#census", label: "Census" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#council", label: "Council" },
  { href: "#feedback", label: "Feedback" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <Image src="/logo.png" alt="FUTO crest" width={44} height={44} className="h-11 w-11 object-contain" priority />
          <span className="hidden text-sm font-semibold leading-tight sm:block">
            FUTO Biology
            <br />
            <span className="text-gold-500">Alumni Association</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/85 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-gold-400">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
