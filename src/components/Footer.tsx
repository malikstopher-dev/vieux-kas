import Image from "next/image";
import Link from "next/link";
import type {Locale, SiteCopy} from "@/lib/site";
import {company, routeFor} from "@/lib/site";

export function Footer({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  const nav = [["about", copy.nav.company], ["products", copy.nav.products], ["procurement", copy.nav.procurement], ["industries", copy.nav.industries], ["rfq", copy.nav.quote]] as const;
  return <footer className="site-footer">
    <div className="footer-grid shell">
      <div className="footer-brand">
        <Image src="/assets/akglobal/brand/akglobal-logo-transparent.png" width={1010} height={640} alt="AKGLOBAL Trading Pty" sizes="220px" />
        <p>{copy.footer.statement}</p>
      </div>
      <div className="footer-nav">
        <p className="footer-label">{copy.footer.navigation}</p>
        {nav.map(([key, label]) => <Link key={key} href={routeFor(key, locale)}>{label}</Link>)}
      </div>
      <div className="footer-contact">
        <p className="footer-label">{copy.footer.contact}</p>
        <a href={company.phoneHref}>{company.phoneDisplay}</a>
        {company.emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}
        <address>{company.address.join(", ")}</address>
      </div>
    </div>
    <div className="footer-bottom shell">
      <p>© {new Date().getFullYear()} {copy.footer.legal}</p>
      <p>REG. NO. {company.registration}</p>
      <p>{copy.footer.location}</p>
    </div>
  </footer>;
}
