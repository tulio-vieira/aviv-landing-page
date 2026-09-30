type ServiceItemProps = {
  title: string;
  description: string;
  isH1?: boolean
};

export function ServiceItem({ title, description, isH1 }: ServiceItemProps) {
  return (
    <div>
      {isH1 ?
        <h1 className="font-heading text-graphite text-lg tracking-wide">{title}</h1> :
        <h3 className="font-heading text-graphite text-lg tracking-wide">{title}</h3>
      }
      <p className="text-graphite/80 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
