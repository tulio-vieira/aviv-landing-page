import { SectionPill } from "@/components/SectionPill";
import { ServiceItem } from "@/components/ServiceItem";

const SERVICOS = [
  {
    title: "Preparação de originais",
    description:
      "Conhecer o texto e seu autor para juntos criarmos uma obra única.",
  },
  {
    title: "Estruturação textual",
    description:
      "Uma visão crítica sobre o texto para torná-lo ainda mais atrativo ao público.",
  },
  {
    title: "Revisão e tradução",
    description: "Revisões ortográfica, técnica e de prova. Tradução inglês/português.",
  },
  {
    title: "Edição e acompanhamento gráfico",
    description:
      "Produção visual da capa e do miolo, sob critérios de unicidade e qualidade.",
  },
];

export function Servicos() {
  return (
    <section id="o-que-fazemos" className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <SectionPill>O que fazemos</SectionPill>
      <p className="text-maroon mt-6 text-lg font-medium sm:text-xl">
        Serviços editoriais para o universo cristão
      </p>

      <div className="mt-10 grid gap-x-10 gap-y-8 text-center sm:grid-cols-2">
        {SERVICOS.map((servico) => (
          <ServiceItem key={servico.title} {...servico} />
        ))}
      </div>
    </section>
  );
}
