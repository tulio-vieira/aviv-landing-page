import { LogoLettering } from "@/components/brand/LogoLettering";
import { SocialLinks } from "@/components/SocialLinks";
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { NAV_LINKS } from "@/config/site";

export function Topbar() {
  return (
    <header className="bg-maroon sticky top-0 z-50 relative text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div style={{maxWidth: 90}} className="me-auto">
          <a
            href="#top"
            className="w-24 shrink-0 sm:w-28"
            aria-label="aviv SDG editorial, página inicial"
          >
            <LogoLettering />
          </a>
        </div>

        <nav
          className="hidden gap-6 font-medium md:flex me-10"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <SocialLinks className="flex items-center gap-3" iconClassName="h-7 w-7" />
        </div>

        <MobileMenuToggle />
      </div>
    </header>
  );
}
