type ServiceItemProps = {
  title: string;
  description: string;
};

export function ServiceItem({ title, description }: ServiceItemProps) {
  return (
    <div>
      <h3 className="font-heading text-graphite text-lg tracking-wide">{title}</h3>
      <p className="text-graphite/80 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
