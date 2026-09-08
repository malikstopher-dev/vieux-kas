import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {InnerHero} from "./InnerHero";

export function ProcurementPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <InnerHero kicker={copy.procurement.kicker} title={copy.procurement.title} lead={copy.procurement.lead} image="/assets/akglobal/categories/procurement-sourcing.jpg" imageAlt={locale === "en" ? "Industrial warehouse prepared for procurement and supply" : "Entrepôt industriel pour l’approvisionnement"} />
    <section className="accepts-section section-pad"><div className="shell accepts-grid">
      <div><p className="kicker">RFQ / INPUT</p><h2>{copy.procurement.acceptsTitle}</h2><p>{copy.common.specification}</p></div>
      <ul>{copy.procurement.accepts.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</li>)}</ul>
    </div></section>
    <section className="procurement-process section-pad offwhite-section"><div className="shell">
      <div className="process-title"><p className="kicker">PROCESS / 01—04</p><h2>{copy.procurement.processTitle}</h2></div>
      <div className="procurement-steps">{copy.procurement.process.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      <p className="boundary-note">{copy.procurement.boundary}</p>
    </div></section>
    <section className="final-cta section-pad"><div className="shell cta-grid">
      <div><p className="kicker">RFQ / AKGLOBAL</p><h2>{copy.home.ctaTitle}</h2><p>{copy.home.ctaBody}</p></div>
      <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
    </div></section>
  </main>;
}
