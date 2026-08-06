"use client";

import { useState } from "react";
import { SocialLinks } from "@/components/SocialLinks";
import { NAV_LINKS } from "@/config/site";

export function MobileMenuToggle() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded p-2 cursor-pointer"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          {isMenuOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="bg-maroon absolute inset-x-0 top-full border-t border-white/20"
        >
          <nav
            className="flex flex-col gap-1 px-4 py-3"
            aria-label="Navegação móvel"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded px-2 py-2 text-sm font-medium tracking-wide hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="border-t border-white/20 px-4 py-3">
            <SocialLinks className="flex items-center gap-4" iconClassName="h-7 w-7" />
          </div>
        </div>
      )}
    </div>
  );
}
