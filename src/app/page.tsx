import { Hero } from "@/components/Hero";
import { Sobre } from "@/components/Sobre";
import { BookCarousel } from "@/components/carousel/BookCarousel";
import { Servicos } from "@/components/Servicos";
import { ComoAtuamos } from "@/components/ComoAtuamos";
import { AmazonBanner } from "@/components/AmazonBanner";
import { Contato } from "@/components/Contato";
import { CONTACT, SITE_NAME, SITE_URL } from "@/config/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brasília",
    addressRegion: "DF",
    addressCountry: "BR",
  },
  sameAs: [CONTACT.instagramUrl],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <Sobre />
      <BookCarousel />
      <Servicos />
      <ComoAtuamos />
      <AmazonBanner />
      <Contato />
    </>
  );
}
