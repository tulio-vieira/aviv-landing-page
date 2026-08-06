import { readBrandSvg } from "@/lib/read-svg";

const markup = readBrandSvg("logo-lettering.svg");

type LogoLetteringProps = {
  className?: string;
};

// Topbar wordmark ("aviv SDG editorial"), used as-is from the design file.
export function LogoLettering({ className }: LogoLetteringProps) {
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
