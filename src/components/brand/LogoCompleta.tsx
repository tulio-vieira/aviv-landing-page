import { readBrandSvg } from "@/lib/read-svg";

const markup = readBrandSvg("logo-completa.svg");

type LogoCompletaProps = {
  className?: string;
};

// Footer badge ("aviv SDG editorial" + flourish), used as-is from the design file.
export function LogoCompleta({ className }: LogoCompletaProps) {
  return (
    <div
      data-brand-svg
      className={className}
      role="img"
      aria-label="aviv SDG editorial"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
