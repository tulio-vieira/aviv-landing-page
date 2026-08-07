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
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const togglePlay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!emblaApi || !autoplay) return;

    const onAutoplayChange = () => setIsPlaying(autoplay.isPlaying());
    emblaApi.on("autoplay:play", onAutoplayChange);
    emblaApi.on("autoplay:stop", onAutoplayChange);
    return () => {
      emblaApi.off("autoplay:play", onAutoplayChange);
      emblaApi.off("autoplay:stop", onAutoplayChange);
    };
  }, [emblaApi]);

  return (
    <section id="livros" className="bg-zinc-100 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-graphite text-center text-2xl tracking-wide sm:text-3xl">
          Nosso catálogo
        </h2>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((slide, index) => (
              <div
                className="min-w-0 flex-[0_0_75%] px-2 sm:flex-[0_0_45%] md:flex-[0_0_30%]"
                key={slide.thumb}
              >
                <button
                  type="button"
                  className="focus-visible:outline-maroon block w-full overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ampliar capa de livro ${index + 1} de ${SLIDE_COUNT}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.thumb}
                    alt={slide.alt}
                    className="aspect-16/9 w-full object-cover"
                    loading="lazy"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Capa anterior"
            className="border-graphite/30 rounded-full border p-2 hover:bg-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? "Pausar apresentação automática do catálogo"
                : "Retomar apresentação automática do catálogo"
            }
            className="border-graphite/30 rounded-full border p-2 hover:bg-white"
          >
            {isPlaying ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5l12 7-12 7V5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Próxima capa"
            className="border-graphite/30 rounded-full border p-2 hover:bg-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
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
