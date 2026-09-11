import {notFound} from "next/navigation";
import {PageRenderer} from "@/components/PageRenderer";
import {getContent, isLocale, locales, pageKeys, resolvePage, routeFor, routes} from "@/lib/site";

type Props = {params: Promise<{locale: string; slug?: string[]}>};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.flatMap((locale) => pageKeys.map((key) => {
    const path = routes[key][locale].replace(`/${locale}`, "").replace(/^\//, "");
    return {locale, slug: path ? path.split("/") : []};
  }));
}

export default async function LocalizedPage({params}: Props) {
  const {locale: rawLocale, slug} = await params;
  if (!isLocale(rawLocale)) notFound();
  const page = resolvePage(rawLocale, slug);
  if (!page) notFound();
  const canonical = `${siteUrl}${routeFor(page, rawLocale)}`;
  const englishUrl = `${siteUrl}${routeFor(page, "en")}`;
  const frenchUrl = `${siteUrl}${routeFor(page, "fr")}`;
  const copy = getContent(rawLocale);
  const [pageTitle, description] = copy.meta[page];
  const title = `${pageTitle} | AKGLOBAL Trading`;
  const image = `${siteUrl}/assets/akglobal/hero/hero-lifting-hook.jpg`;

  return <>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hrefLang="en" href={englishUrl} />
    <link rel="alternate" hrefLang="fr" href={frenchUrl} />
    <link rel="alternate" hrefLang="x-default" href={englishUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AKGLOBAL Trading Pty" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={rawLocale === "en" ? "en_ZA" : "fr_CD"} />
    <meta property="og:locale:alternate" content={rawLocale === "en" ? "fr_CD" : "en_ZA"} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1600" />
    <meta property="og:image:height" content="1000" />
    <meta property="og:image:alt" content="AKGLOBAL Trading industrial supply" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <PageRenderer page={page} locale={rawLocale} copy={copy} />
  </>;
}
