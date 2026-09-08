import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PageRenderer} from "@/components/PageRenderer";
import {getContent, isLocale, locales, pageKeys, resolvePage, routeFor, routes, type Locale} from "@/lib/site";

type Props = {params: Promise<{locale: string; slug?: string[]}>};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.flatMap((locale) => pageKeys.map((key) => {
    const path = routes[key][locale].replace(`/${locale}`, "").replace(/^\//, "");
    return {locale, slug: path ? path.split("/") : []};
  }));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;
  const page = resolvePage(locale, slug);
  if (!page) return {};
  const copy = getContent(locale);
  const [title, description] = copy.meta[page];
  const canonical = `${siteUrl}${routeFor(page, locale)}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {"en-ZA": `${siteUrl}${routeFor(page, "en")}`, "fr-CD": `${siteUrl}${routeFor(page, "fr")}`, "x-default": `${siteUrl}${routeFor(page, "en")}`},
    },
    openGraph: {
      type: "website",
      siteName: "AKGLOBAL Trading Pty",
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_ZA" : "fr_CD",
      alternateLocale: locale === "en" ? ["fr_CD"] : ["en_ZA"],
      images: [{url: "/assets/akglobal/hero/hero-lifting-hook.jpg", width: 1600, height: 1000, alt: "AKGLOBAL Trading industrial supply"}],
    },
    twitter: {card: "summary_large_image", title, description, images: ["/assets/akglobal/hero/hero-lifting-hook.jpg"]},
  };
}

export default async function LocalizedPage({params}: Props) {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) notFound();
  const page = resolvePage(rawLocale, slug);
  if (!page) notFound();
  return <PageRenderer page={page} locale={rawLocale} copy={getContent(rawLocale)} />;
}
