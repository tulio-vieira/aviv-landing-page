import { SectionPill } from "@/components/SectionPill";
import { ServiceItem } from "@/components/ServiceItem";

const ATUACOES = [
  {
    title: "Autopublicação",
    description:
      "Atendemos autores que desejam ter sua obra publicada, sem vínculos com editoras.",
  },
  {
    title: "Coedições",
    description: "Parcerias com editoras comerciais para publicações conjuntas.",
  },
  {
    title: "Trabalhos técnicos",
    description: "Oferecemos nossos serviços e conhecimentos também a outras editoras.",
  },
  {
    title: "Editora",
    description: "Temos um catálogo próprio em constante atualização.",
  },
];

export function ComoAtuamos() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6 sm:pb-24">
      <SectionPill>Como atuamos</SectionPill>

      <div className="mt-10 grid gap-x-10 gap-y-8 text-center sm:grid-cols-2">
        {ATUACOES.map((atuacao) => (
          <ServiceItem key={atuacao.title} {...atuacao} />
        ))}
      </div>
    </section>
  );
}
