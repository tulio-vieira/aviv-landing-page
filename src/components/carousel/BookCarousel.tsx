"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Lightbox } from "./Lightbox";

const SLIDE_COUNT = 12;
const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => {
  const n = i + 1;
  return {
    thumb: `/images/carousel/carrossel-${n}-thumb.webp`,
    full: `/images/carousel/carrossel-${n}-full.webp`,
    alt: `Capa de livro publicado pela aviv SDG Editorial (${n} de ${SLIDE_COUNT})`,
  };
});

export function BookCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  ]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // This useeffect is for resettin autoplay delay everytime the user moves a slide,
  // either by pressing the button our by swipping.
  useEffect(() => {
    if (!emblaApi) return;
    const resetAutoplay = () => emblaApi.plugins()?.autoplay?.reset();
    emblaApi.on("select", resetAutoplay);
    return () => {
      emblaApi.off("select", resetAutoplay);
    };
  }, [emblaApi]);

  return (
    <section id="livros" className="bg-zinc-100 py-16 sm:py-24">
      <h2 className="font-heading text-graphite text-center text-2xl tracking-wide sm:text-3xl mb-14">
        Nosso trabalho
      </h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-4">
            {slides.map((slide, index) => (
              <div className="min-w-0 flex-[0_0_85%]" key={slide.thumb}>
                <button
                  type="button"
                  className="focus-visible:outline-maroon block w-full overflow-hidden transition-transform hover:scale-[1.02] focus-visible:outline"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ampliar capa de livro ${index + 1} de ${SLIDE_COUNT}`}
                >
                  <img
                    src={slide.thumb}
                    alt={slide.alt}
                    className="h-[70vh] max-h-180 min-h-100 w-full object-cover"
                    loading="lazy"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Capa anterior"
          className="text-graphite absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:left-6"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Próxima capa"
          className="text-graphite absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:right-6"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          slides={slides}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
