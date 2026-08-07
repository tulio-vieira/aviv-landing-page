import { CONTACT } from "@/config/site";
import { withBasePath } from "@/config/environment";

export function Contato() {
  return (
    <section id="contato" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
        <div className="text-right">
          <p className="text-graphite text-lg sm:text-xl">
            Deseja saber mais sobre nosso trabalho?
            <br />
            Não encontrou o que procura?
          </p>
          <p className="text-maroon font-heading mt-2 text-2xl tracking-wide sm:text-3xl">
            Vamos conversar!
          </p>
        </div>

        <div className="space-y-3 sm:text-left">
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xl font-semibold sm:justify-end text-maroon"
          >
            {CONTACT.whatsappDisplay}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath("/icons/whatsapp-alt.svg")} alt="" className="h-6 w-6" />
          </a>
          <p className="text-graphite/80">{CONTACT.hours}</p>
          <p className="border-maroon inline-block rounded-full border px-4 py-1 font-medium">
            {CONTACT.hoursNote}
          </p>
          <p>Se precisar, a gente liga pra você. Não se preocupe.</p>
          <p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-maroon hover:underline"
            >
              {CONTACT.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
