import Image from "next/image";
import type {Locale, SiteCopy} from "@/lib/site";
import {company, routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {InnerHero} from "./InnerHero";

export function AboutPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <InnerHero kicker={copy.about.kicker} title={copy.about.title} lead={copy.about.lead} image="/assets/akglobal/hero/hero-industrial-warehouse.jpg" imageAlt={locale === "en" ? "Industrial warehouse environment" : "Environnement d’entrepôt industriel"} />
    <section className="editorial-section section-pad"><div className="shell editorial-grid">
      <div className="editorial-mark"><Image src="/assets/akglobal/brand/akglobal-symbol-transparent.png" alt="" width={1026} height={600} sizes="260px" /></div>
      <div className="editorial-content">{copy.about.sections.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}</div>
    </div></section>
    <section className="company-details section-pad dark-section"><div className="shell">
      <p className="kicker">{copy.about.detailsTitle}</p>
      <div className="details-grid">
        <div><span>Legal name</span><strong>{company.name}</strong></div>
        <div><span>{copy.contact.registration}</span><strong>{company.registration}</strong></div>
        <div><span>{copy.contact.office}</span><strong>{company.address.join(", ")}</strong></div>
        <div><span>{copy.contact.owner}</span><strong>{company.owner}</strong></div>
      </div>
      <div className="details-action"><ActionLink href={routeFor("contact", locale)} variant="light">{copy.nav.contact}</ActionLink></div>
    </div></section>
  </main>;
}
