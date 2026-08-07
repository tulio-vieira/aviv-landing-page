import logoCompleta from "@/assets/svg/logo-completa.svg";

type LogoCompletaProps = {
  className?: string;
};

// Footer badge ("aviv SDG editorial" + flourish), used as-is from the design file.
export function LogoCompleta({ className }: LogoCompletaProps) {
  return (
    <img
      src={logoCompleta.src}
      alt="aviv SDG editorial"
      className={["block h-auto w-full", className].filter(Boolean).join(" ")}
    />
  );
}
