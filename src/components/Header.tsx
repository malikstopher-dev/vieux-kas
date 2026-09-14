"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import type {Locale, PageKey, SiteCopy} from "@/lib/site";
import {pageFromPath, routeFor} from "@/lib/site";
import {AnimatedHamburger, ArrowIcon} from "./Icons";

type Props = {locale: Locale; copy: SiteCopy};

export function Header({locale, copy}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [transparent, setTransparent] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const page = pageFromPath(pathname);

  useEffect(() => {
    const updateHeader = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 48);
      setTransparent(scrollY < 16);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, {passive: true});
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollY = window.scrollY;
    const menuButton = menuButtonRef.current;
    const content = document.getElementById("main-content");
    const footer = document.querySelector<HTMLElement>(".site-footer");
    const contentWasInert = content?.hasAttribute("inert") ?? false;
    const footerWasInert = footer?.hasAttribute("inert") ?? false;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    content?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const focusFirstLink = (attempt: number) => {
      const drawer = drawerRef.current;
      const firstLink = drawer?.querySelector<HTMLElement>('a[href]');
      if (!drawer || !firstLink) return;
      if (getComputedStyle(drawer).visibility === "visible") {
        firstLink.focus({preventScroll: true});
      } else if (attempt < 8) {
        window.setTimeout(() => focusFirstLink(attempt + 1), 60);
      }
    };
    const frame = window.setTimeout(() => focusFirstLink(0), 60);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const handleResize = () => {if (window.innerWidth > 900) setOpen(false);};
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(frame);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
      if (!contentWasInert) content?.removeAttribute("inert");
      if (!footerWasInert) footer?.removeAttribute("inert");
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      menuButton?.focus();
    };
  }, [open]);

  const saveLocale = (next: Locale) => {
    document.cookie = `akglobal-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
  };

  const productsPages = ["products", "lifting", "fasteners", "hardware"];
  const isActive = (key: string) => page === key || (key === "products" && page !== undefined && productsPages.includes(page));

  const mobileNav = [
    ["home", copy.common.home],
    ["about", copy.nav.company],
    ["industries", locale === "en" ? "Solutions" : "Solutions"],
    ["products", copy.nav.products],
    ["procurement", copy.nav.procurement],
    ["industries", copy.nav.industries],
    ["about", locale === "en" ? "Capabilities" : "Capacités"],
    ["contact", copy.nav.contact],
  ] as [PageKey, string][];
  const desktopNav = [
    ["about", copy.nav.company],
    ["products", copy.nav.products],
    ["procurement", copy.nav.procurement],
    ["industries", copy.nav.industries],
    ["contact", copy.nav.contact],
  ] as const;
  const primaryLabel = locale === "en" ? "Primary navigation" : "Navigation principale";
  const mobileLabel = locale === "en" ? "Mobile navigation" : "Navigation mobile";
  const languageLabel = locale === "en" ? "Language" : "Langue";

  return (
    <>
      <header className={`site-header ${transparent && !open ? "transparent" : ""} ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}>
        <div className="header-inner shell">
          <Link href={routeFor("home", locale)} className="brand-link" aria-label={`${copy.common.home} \u2014 AKGLOBAL Trading`}>
            <Image className="brand-full" src="/assets/akglobal/brand/akglobal-logo-transparent.png" alt="AKGLOBAL Trading Pty" width={1010} height={640} loading="eager" sizes="180px" />
            <Image className="brand-symbol" src="/assets/akglobal/brand/akglobal-symbol-transparent.png" alt="" width={1026} height={600} loading="eager" sizes="68px" />
          </Link>
          <nav className="desktop-nav" aria-label={primaryLabel}>
            {desktopNav.map(([key, label]) => <Link key={key} href={routeFor(key, locale)} className={isActive(key) ? "active" : ""} aria-current={isActive(key) ? "page" : undefined}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <div className="locale-switch" role="group" aria-label={languageLabel}>
              <Link href={routeFor(page ?? "home", "en")} lang="en" aria-current={locale === "en" ? "page" : undefined} onClick={() => saveLocale("en")}>EN</Link>
              <span aria-hidden="true">|</span>
              <Link href={routeFor(page ?? "home", "fr")} lang="fr" aria-current={locale === "fr" ? "page" : undefined} onClick={() => saveLocale("fr")}>FR</Link>
            </div>
            <Link href={routeFor("rfq", locale)} className={`header-quote ${page === "rfq" ? "active" : ""}`} aria-current={page === "rfq" ? "page" : undefined}><span>{copy.nav.quote}</span><ArrowIcon /></Link>
            <button ref={menuButtonRef} className="menu-trigger" type="button" aria-label={open ? copy.nav.close : copy.nav.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
              <AnimatedHamburger open={open} />
            </button>
          </div>
        </div>
      </header>
      <div ref={drawerRef} id="mobile-navigation" className={`mobile-drawer ${open ? "open" : ""}`} role="dialog" aria-modal={open ? "true" : undefined} aria-label={mobileLabel} aria-hidden={!open}>
        <div className="mobile-drawer-inner shell">
          <nav className="mobile-nav" aria-label={primaryLabel}>
            {mobileNav.map(([key, label], index) => {
              const num = String(index + 1).padStart(2, "0");
              return <Link key={`${key}-${index}`} href={routeFor(key, locale)} className={isActive(key) ? "active" : ""} aria-current={isActive(key) ? "page" : undefined} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span className="mobile-nav-num">{num}</span><span className="mobile-nav-label">{label}</span><ArrowIcon className="mobile-nav-arrow" /></Link>;
            })}
          </nav>
          <div className="mobile-drawer-footer">
            <Link className="mobile-quote" href={routeFor("rfq", locale)} aria-current={page === "rfq" ? "page" : undefined} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{copy.nav.quote}<ArrowIcon /></Link>
            <div className="mobile-locale-row">
              <Link href={routeFor(page ?? "home", "en")} lang="en" className={`mobile-locale-item ${locale === "en" ? "active" : ""}`} onClick={() => saveLocale("en")} tabIndex={open ? 0 : -1}>EN</Link>
              <Link href={routeFor(page ?? "home", "fr")} lang="fr" className={`mobile-locale-item ${locale === "fr" ? "active" : ""}`} onClick={() => saveLocale("fr")} tabIndex={open ? 0 : -1}>FR</Link>
            </div>
            <p className="mobile-drawer-note">{copy.common.based}</p>
          </div>
        </div>
      </div>
    </>
  );
}
