import { CONTACT } from "@/config/site";

export function Contato() {
  return (
    <section id="contato" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-graphite text-lg sm:text-xl">
            Deseja saber mais sobre nosso trabalho?
            <br />
            Não encontrou o que procura?
          </p>
          <p className="text-maroon font-heading mt-2 text-2xl tracking-wide sm:text-3xl">
            Vamos conversar!
          </p>
        </div>

        <div className="space-y-3 sm:text-right">
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-graphite inline-flex items-center gap-2 text-xl font-semibold sm:justify-end"
          >
            {CONTACT.whatsappDisplay}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/whatsapp.svg" alt="" className="h-6 w-6" />
          </a>
          <p className="text-graphite/80 text-sm">{CONTACT.hours}</p>
          <p className="border-maroon text-maroon inline-block rounded-full border px-4 py-1 text-sm font-medium">
            {CONTACT.hoursNote}
          </p>
          <p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-maroon text-sm hover:underline"
            >
              {CONTACT.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
