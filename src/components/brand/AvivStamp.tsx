import { readBrandSvg } from "@/lib/read-svg";

const markup = readBrandSvg("aviv-stamp.svg");

type AvivStampProps = {
  className?: string;
};

// The circular "aviv · Soli Deo Gloria · editorial" hero stamp, used as-is from
// the design file (see globals.css for the font-substitution note).
export function AvivStamp({ className }: AvivStampProps) {
  return (
    <div
      data-brand-svg
      className={className}
      role="img"
      aria-label="Selo aviv SDG editorial: aviv, Soli Deo Gloria, editorial. Mateus 6:28, Olhai para os lírios do campo, como eles crescem."
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
