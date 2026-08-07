import type { Metadata } from "next";
import { Oswald, Source_Sans_3, EB_Garamond, Bebas_Neue } from "next/font/google";
import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { environmentConfig } from "@/config/environment";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "latin-ext"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const TAGLINE = "Serviços editoriais para o universo cristão";
const DESCRIPTION =
  "Editora cristã especializada em preparação de originais, revisão, tradução e edição gráfica, com atendimento a autores independentes e editoras parceiras.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "editora cristã",
    "preparação de originais",
    "revisão de texto",
    "tradução de livros",
    "autopublicação",
    "coedição",
    "aviv SDG",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: environmentConfig.allowIndexing,
    follow: environmentConfig.allowIndexing,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} ${oswald.variable} ${ebGaramond.variable} ${bebasNeue.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-white">
        <Topbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
