export const SITE_URL = "https://www.avivsdg.com.br";
export const SITE_NAME = "aviv SDG Editorial";

const WHATSAPP_NUMBER = "556130303030"; // +55 61 3030-3030, as provided

export const CONTACT = {
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: "61 3030-3030",
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  // TODO: replace with the real Instagram handle once available.
  instagramUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: "atendimento@avivsdg.com.br",
  hours: "De segunda a sexta-feira, das 9 às 18h",
  hoursNote: "Atendimento EXCLUSIVAMENTE por WhatsApp",
} as const;

export const NAV_LINKS = [
  { href: "#sobre", label: "Sobre nós" },
  { href: "#o-que-fazemos", label: "O que fazemos" },
  { href: "#contato", label: "Contato" },
] as const;
