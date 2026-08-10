"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Lightbox } from "./Lightbox";
import { withBasePath } from "@/config/environment";
import { useAfterInitialLoad } from "@/hooks/useAfterInitialLoad";
import { useSlowConnection } from "@/hooks/useSlowConnection";

const SLIDE_COUNT = 12;
const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => {
  const n = i + 1;
  return {
    thumb: withBasePath(`/images/carousel/carrossel-${n}-thumb.webp`),
    full: withBasePath(`/images/carousel/carrossel-${n}-full.webp`),
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
  const [upgradedSlides, setUpgradedSlides] = useState<ReadonlySet<number>>(
    () => new Set()
  );
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const afterInitialLoad = useAfterInitialLoad();
  const isSlowConnection = useSlowConnection();

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // This useeffect is for resetting autoplay delay everytime the user moves a slide,
  // either by pressing the button our by swipping.
  useEffect(() => {
    if (!emblaApi) return;
    const resetAutoplay = () => emblaApi.plugins()?.autoplay?.reset();
    emblaApi.on("select", resetAutoplay);
    return () => {
      emblaApi.off("select", resetAutoplay);
    };
  }, [emblaApi]);

  // Upgrade each slide from thumb to full once it's ~one slide-width from
  // view, but only after the initial page load and never on slow connections.
  useEffect(() => {
    if (!afterInitialLoad || isSlowConnection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.slideIndex);
          setUpgradedSlides((prev) => {
            if (prev.has(index)) return prev;
            return new Set(prev).add(index);
          });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "100% 0px" }
    );

    for (const el of slideRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [afterInitialLoad, isSlowConnection]);

  return (
    <section id="livros" className="bg-zinc-100 py-16 sm:py-24">
      <h2 className="font-oswald font-bold text-2xl text-graphite sm:text-3xl text-center tracking-wide mb-16">
        Nosso trabalho
      </h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-4">
            {slides.map((slide, index) => (
              <div
                className="min-w-0 flex-[0_0_85%]"
                key={slide.thumb}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                data-slide-index={index}
              >
                <button
                  type="button"
                  className="focus-visible:outline-maroon block w-full overflow-hidden transition-transform hover:scale-[1.02] focus-visible:outline"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ampliar capa de livro ${index + 1} de ${SLIDE_COUNT}`}
                >
                  <img
                    src={upgradedSlides.has(index) ? slide.full : slide.thumb}
                    alt={slide.alt}
                    className="h-[70vh] max-h-50 sm:max-h-140 sm:min-h-100 w-full object-cover cursor-pointer"
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
          className="text-graphite absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:left-6 cursor-pointer"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Próxima capa"
          className="text-graphite absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:right-6 cursor-pointer"
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
