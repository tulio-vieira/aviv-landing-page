import avivStamp from "@/assets/svg/aviv-stamp.svg";

type AvivStampProps = {
  className?: string;
};

// The circular "aviv · Soli Deo Gloria · editorial" hero stamp, used as-is from
// the design file.
export function AvivStamp({ className }: AvivStampProps) {
  return (
    <img
      src={avivStamp.src}
      alt="Selo aviv SDG editorial: aviv, Soli Deo Gloria, editorial. Mateus 6:28, Olhai para os lírios do campo, como eles crescem."
      className={["block h-auto w-full", className].filter(Boolean).join(" ")}
    />
  );
}
