import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {InnerHero} from "./InnerHero";

export function IndustriesPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <InnerHero kicker={copy.industries.kicker} title={copy.industries.title} lead={copy.industries.lead} image="/assets/akglobal/hero/hero-industrial-warehouse.jpg" imageAlt={locale === "en" ? "Industrial operations environment" : "Environnement d’opérations industrielles"} />
    <section className="industries-page section-pad"><div className="shell">
      <div className="industries-grid">{copy.industries.items.map((item, i) => <article key={item}><span>{String(i + 1).padStart(2, "0")}</span><h2>{item}</h2><div className="industry-cross" aria-hidden="true">+</div></article>)}</div>
      <p className="boundary-note">{copy.industries.disclaimer}</p>
    </div></section>
    <section className="product-rfq section-pad dark-section"><div className="shell note-grid"><div><p className="kicker">INDUSTRY / RFQ</p><h2>{copy.home.ctaTitle}</h2><p>{copy.home.ctaBody}</p></div><ActionLink href={routeFor("rfq", locale)} variant="light">{copy.common.quote}</ActionLink></div></section>
  </main>;
}
