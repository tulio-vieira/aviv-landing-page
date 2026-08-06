type SectionPillProps = {
  children: React.ReactNode;
};

export function SectionPill({ children }: SectionPillProps) {
  return (
    <h2 className="border-maroon text-maroon font-heading inline-block rounded-full border px-6 py-2 text-xl tracking-wide uppercase">
      {children}
    </h2>
  );
}
