import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-forest-950 py-10 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm sm:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <span>
            Department of Biology Alumni Association
            <br />
            <span className="text-white/50">Federal University of Technology, Owerri</span>
          </span>
        </div>
        <p>&copy; {new Date().getFullYear()} FUTO Biology Alumni. Technology for Service.</p>
      </div>
    </footer>
  );
}
