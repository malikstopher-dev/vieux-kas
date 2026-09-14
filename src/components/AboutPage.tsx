import {heroAssets} from "@/lib/heroAssets";
import type {Locale, SiteCopy} from "@/lib/site";
import {company, routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {PremiumHero} from "./PremiumHero";
import {ResponsivePicture} from "./ResponsivePicture";

export function AboutPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <PremiumHero
      asset={heroAssets.companyPrimary}
      imageAlt={locale === "en" ? "AKGLOBAL executive industrial oversight office" : "Bureau de supervision industrielle AKGLOBAL"}
      kicker={copy.about.kicker}
      title={copy.about.title}
      lead={copy.about.lead}
      mobileTitle={locale === "en" ? <><span>Industrial trading.</span><span className="outline-word">Built around your requirement.</span></> : <><span>Négoce industriel.</span><span className="outline-word">Organisé autour de votre besoin.</span></>}
      mobileLead={locale === "en" ? "South African industrial trading and procurement serving SA and the DRC." : "Négoce et approvisionnement industriel sud-africain pour l'Afrique du Sud et la RDC."}
      variant="split"
      overlay="strong"
      primaryAction={{href: routeFor("rfq", locale), label: copy.common.quote}}
      secondaryAction={{href: routeFor("contact", locale), label: copy.nav.contact}}
    />
    <section className="editorial-section section-pad"><div className="shell editorial-grid">
      <div className="editorial-media"><ResponsivePicture desktopSrc={heroAssets.companySecondary.desktop} mobileSrc={heroAssets.companySecondary.mobile} alt={locale === "en" ? "AKGLOBAL industrial office and sourcing workspace" : "Espace de travail industriel et d’approvisionnement AKGLOBAL"} /></div>
      <div className="editorial-content">{copy.about.sections.map(([title, body], i) => <article key={title}><span>0{i + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}</div>
    </div></section>
    <section className="company-details section-pad dark-section"><div className="shell">
      <p className="kicker">{copy.about.detailsTitle}</p>
      <div className="details-grid">
        <div><span>{locale === "en" ? "Legal name" : "Dénomination légale"}</span><strong>{company.name}</strong></div>
        <div><span>{copy.contact.registration}</span><strong>{company.registration}</strong></div>
        <div><span>{copy.contact.office}</span><strong>{company.address.join(", ")}</strong></div>
        <div><span>{copy.contact.owner}</span><strong>{company.owner}</strong></div>
      </div>
      <div className="details-action"><ActionLink href={routeFor("contact", locale)} variant="light">{copy.nav.contact}</ActionLink></div>
    </div></section>
  </main>;
}
