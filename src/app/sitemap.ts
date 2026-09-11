import type {MetadataRoute} from "next";
import {pageKeys, routeFor} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return pageKeys.flatMap((page) => (["en", "fr"] as const).map((locale) => ({
    url: `${siteUrl}${routeFor(page, locale)}`,
    lastModified: new Date(),
    changeFrequency: page === "home" ? "weekly" as const : "monthly" as const,
    priority: page === "home" ? 1 : page === "rfq" ? 0.9 : 0.7,
    alternates: {languages: {en: `${siteUrl}${routeFor(page, "en")}`, fr: `${siteUrl}${routeFor(page, "fr")}`, "x-default": `${siteUrl}${routeFor(page, "en")}`}},
  })));
}
