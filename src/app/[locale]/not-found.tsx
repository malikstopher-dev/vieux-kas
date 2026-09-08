"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {getContent, routeFor, type Locale} from "@/lib/site";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/fr") ? "fr" : "en";
  const copy = getContent(locale);
  return <main className="not-found"><div className="shell"><p className="kicker">404 / AKGLOBAL</p><h1>{copy.notFound.title}</h1><p>{copy.notFound.body}</p><div><Link href={routeFor("home", locale)}>{copy.common.home}</Link><Link href={routeFor("products", locale)}>{copy.notFound.products}</Link><Link href={routeFor("rfq", locale)}>{copy.common.quote}</Link></div></div></main>;
}
