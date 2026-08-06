import { LogoCompleta } from "@/components/brand/LogoCompleta";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-graphite mt-auto px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/80">
          © {year} aviv SDG Editorial | Brasília - DF
        </p>
        <div className="w-16">
          <LogoCompleta />
        </div>
      </div>
    </footer>
  );
}
