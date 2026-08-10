type SectionPillProps = {
  children: React.ReactNode;
};

export function SectionPill({ children }: SectionPillProps) {
  return (
    <h2 className="border-maroon font-bold font-oswald inline-block rounded-full border px-6 py-2 text-2xl text-graphite tracking-wide">
      {children}
    </h2>
  );
}
