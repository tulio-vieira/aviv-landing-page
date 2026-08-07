import { AvivStamp } from "@/components/brand/AvivStamp";
import { HeroBackground } from "@/components/HeroBackground";
import { withBasePath } from "@/config/environment";

export function Hero() {
  return (
    <section
      id="top"
      className="bg-graphite relative flex min-h-[85vh] items-center justify-center overflow-hidden"
    >
      <HeroBackground
        videoWebmSrc={withBasePath("/videos/hero.webm")}
        videoMp4Src={withBasePath("/videos/hero.mp4")}
        posterSrc={withBasePath("/images/hero-poster.webp")}
      />

      <div className="relative z-10 w-56 sm:w-72 md:w-80">
        <AvivStamp />
      </div>
    </section>
  );
}
