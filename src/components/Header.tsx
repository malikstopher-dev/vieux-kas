"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import type {Locale, SiteCopy} from "@/lib/site";
import {pageFromPath, routeFor, switchLocalePath} from "@/lib/site";
import {ArrowIcon, CloseIcon, MenuIcon} from "./Icons";

type Props = {locale: Locale; copy: SiteCopy};

export function Header({locale, copy}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const page = pageFromPath(pathname);
  const targetLocale: Locale = locale === "en" ? "fr" : "en";
  const localeHref = switchLocalePath(pathname, targetLocale);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {document.body.style.overflow = previous;};
  }, [open]);

  const saveLocale = (next: Locale) => {
    document.cookie = `akglobal-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
  };

  const nav = [
    ["about", copy.nav.company],
    ["products", copy.nav.products],
    ["procurement", copy.nav.procurement],
    ["industries", copy.nav.industries],
    ["contact", copy.nav.contact],
  ] as const;

  return <header className="site-header">
    <div className="header-inner shell">
      <Link href={routeFor("home", locale)} className="brand-link" aria-label={`${copy.common.home} — AKGLOBAL Trading`}>
        <Image className="brand-full" src="/assets/akglobal/brand/akglobal-logo-transparent.png" alt="AKGLOBAL Trading Pty" width={1010} height={640} priority sizes="180px" />
        <Image className="brand-symbol" src="/assets/akglobal/brand/akglobal-symbol-transparent.png" alt="" width={1026} height={600} priority sizes="68px" />
      </Link>
      <nav className="desktop-nav" aria-label="Primary">
        {nav.map(([key, label]) => <Link key={key} href={routeFor(key, locale)} className={page === key ? "active" : ""}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <div className="locale-switch" aria-label="Language">
          <Link href={routeFor(page ?? "home", "en")} lang="en" aria-current={locale === "en" ? "page" : undefined} onClick={() => saveLocale("en")}>EN</Link>
          <span aria-hidden="true">|</span>
          <Link href={routeFor(page ?? "home", "fr")} lang="fr" aria-current={locale === "fr" ? "page" : undefined} onClick={() => saveLocale("fr")}>FR</Link>
        </div>
        <Link href={routeFor("rfq", locale)} className="header-quote"><span>{copy.nav.quote}</span><ArrowIcon /></Link>
        <button className="menu-trigger" type="button" aria-label={open ? copy.nav.close : copy.nav.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </div>
    <div id="mobile-navigation" className={`mobile-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <nav aria-label="Mobile primary">
        {nav.map(([key, label], index) => <Link key={key} href={routeFor(key, locale)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>0{index + 1}</span>{label}</Link>)}
      </nav>
      <Link className="mobile-quote" href={routeFor("rfq", locale)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{copy.nav.quote}<ArrowIcon /></Link>
      <Link className="mobile-locale" href={localeHref} lang={targetLocale} onClick={() => saveLocale(targetLocale)} tabIndex={open ? 0 : -1}>{targetLocale === "fr" ? "Passer en français" : "Switch to English"}<ArrowIcon /></Link>
      <p>{copy.common.based}</p>
    </div>
  </header>;
}
