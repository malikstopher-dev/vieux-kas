import {heroAssets} from "@/lib/heroAssets";
import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {PremiumHero} from "./PremiumHero";

export function ProcurementPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <PremiumHero
      asset={heroAssets.procurementPrimary}
      imageAlt={locale === "en" ? "AKGLOBAL warehouse, freight and global logistics operations" : "Entrepôt, fret et opérations logistiques internationales AKGLOBAL"}
      kicker={copy.procurement.kicker}
      title={copy.procurement.title}
      lead={copy.procurement.lead}
      mobileTitle={locale === "en" ? <><span>Procurement.</span><span className="outline-word">From requirement to supply.</span></> : <><span>Approvisionnement.</span><span className="outline-word">Du besoin à la fourniture.</span></>}
      mobileLead={locale === "en" ? "Send your RFQ. We assess sourcing. You receive a clear quotation." : "Envoyez votre demande. Nous évaluons l'approvisionnement. Vous recevez un devis clair."}
      overlay="strong"
      primaryAction={{href: routeFor("rfq", locale), label: copy.common.quote}}
      secondaryAction={{href: "#procurement-process", label: copy.common.learnMore}}
    />
    <section className="accepts-section section-pad"><div className="shell accepts-grid">
      <div><p className="kicker">{locale === "en" ? "RFQ / INPUT" : "DEVIS / INFORMATIONS"}</p><h2>{copy.procurement.acceptsTitle}</h2><p>{copy.common.specification}</p></div>
      <ul>{copy.procurement.accepts.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</li>)}</ul>
    </div></section>
    <section id="procurement-process" className="procurement-process section-pad offwhite-section"><div className="shell">
      <div className="process-title"><p className="kicker">{locale === "en" ? "PROCESS / 01—04" : "PROCESSUS / 01—04"}</p><h2>{copy.procurement.processTitle}</h2></div>
      <div className="procurement-steps">{copy.procurement.process.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      <p className="boundary-note">{copy.procurement.boundary}</p>
    </div></section>
    <section className="final-cta section-pad"><div className="shell cta-grid">
      <div><p className="kicker">{locale === "en" ? "RFQ" : "DEVIS"} / AKGLOBAL</p><h2>{copy.home.ctaTitle}</h2><p>{copy.home.ctaBody}</p></div>
      <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
    </div></section>
  </main>;
}
