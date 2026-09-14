import type {Metadata} from "next";
import {Inter, Playfair_Display} from "next/font/google";
import {notFound} from "next/navigation";
import {Footer} from "@/components/Footer";
import {Header} from "@/components/Header";
import {company, getContent, isLocale, locales} from "@/lib/site";
import "../globals.css";

const inter = Inter({subsets: ["latin"], variable: "--font-sans", display: "swap"});
const playfair = Playfair_Display({subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700"]});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {icon: "/assets/akglobal/brand/akglobal-symbol-transparent.png", apple: "/assets/akglobal/brand/akglobal-symbol-transparent.png"},
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale = requestedLocale;
  const copy = getContent(locale);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    identifier: company.registration,
    telephone: "+27829556071",
    email: company.emails[0],
    address: {"@type": "PostalAddress", streetAddress: "1 Broadacres Drive", addressLocality: "Fourways, Sandton", postalCode: "2055", addressCountry: "ZA"},
    areaServed: [{"@type": "Country", name: "South Africa"}, {"@type": "Country", name: "Democratic Republic of the Congo"}],
  };

  return <html lang={locale === "en" ? "en-ZA" : "fr-CD"} className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
    <body>
      <a className="skip-link" href="#main-content">{locale === "en" ? "Skip to content" : "Aller au contenu"}</a>
      <Header locale={locale} copy={copy} />
      <div id="main-content">{children}</div>
      <Footer locale={locale} copy={copy} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g, "\\u003c")}} />
    </body>
  </html>;
}
