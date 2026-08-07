"use client";

import { useEffect, useRef } from "react";

type Slide = {
  thumb: string;
  full: string;
  alt: string;
};

type LightboxProps = {
  slides: Slide[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({ slides, index, onClose, onIndexChange }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const slide = slides[index];

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        onIndexChange((index + 1) % slides.length);
      }
      if (event.key === "ArrowLeft") {
        onIndexChange((index - 1 + slides.length) % slides.length);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [index, slides.length, onClose, onIndexChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Capa de livro ampliada"
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 rounded-full p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-white cursor-pointer"
      >
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Capa anterior"
        onClick={(event) => {
          event.stopPropagation();
          onIndexChange((index - 1 + slides.length) % slides.length);
        }}
        className="absolute left-2 rounded-full p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-white sm:left-6 cursor-pointer"
      >
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <img
        src={slide.full}
        alt={slide.alt}
        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        aria-label="Próxima capa"
        onClick={(event) => {
          event.stopPropagation();
          onIndexChange((index + 1) % slides.length);
        }}
        className="absolute right-2 rounded-full p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-white sm:right-6 cursor-pointer"
      >
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
