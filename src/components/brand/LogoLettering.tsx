import logoLettering from "@/assets/svg/logo-lettering.svg";

type LogoLetteringProps = {
  className?: string;
};

// Topbar wordmark ("aviv SDG editorial"), used as-is from the design file.
export function LogoLettering({ className }: LogoLetteringProps) {
  return (
    <img
      src={logoLettering.src}
      alt="aviv SDG editorial"
      className={["block h-auto w-full", className].filter(Boolean).join(" ")}
    />
  );
}
