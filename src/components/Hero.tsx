import { AvivStamp } from "@/components/brand/AvivStamp";
import { HeroBackground } from "@/components/HeroBackground";

export function Hero() {
  return (
    <section
      id="top"
      className="bg-graphite relative flex min-h-[85vh] items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      <div className="relative z-10 w-56 sm:w-72 md:w-80 2xl:w-100">
        <AvivStamp />
      </div>
    </section>
  );
}
