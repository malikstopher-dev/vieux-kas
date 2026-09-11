import {Suspense} from "react";
import {heroAssets} from "@/lib/heroAssets";
import type {Locale, SiteCopy} from "@/lib/site";
import {PremiumHero} from "./PremiumHero";
import {RFQForm} from "./RFQForm";

export function RFQPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <PremiumHero
      asset={heroAssets.procurementSecondary}
      imageAlt={locale === "en" ? "AKGLOBAL sourcing and cross-border logistics coordination" : "Coordination AKGLOBAL de l’approvisionnement et de la logistique transfrontalière"}
      kicker={copy.rfq.kicker}
      title={copy.rfq.title}
      lead={copy.rfq.lead}
      size="compact"
      overlay="strong"
      primaryAction={{href: "#rfq-form", label: copy.rfq.submit}}
    />
    <section id="rfq-form" className="rfq-section section-pad"><div className="shell rfq-layout">
      <aside><p className="technical-caption">AK / RFQ / {new Date().getFullYear()}</p><h2>{copy.common.based}</h2><p>{copy.common.specification}</p><div className="aside-rule" /></aside>
      <Suspense fallback={<div className="rfq-loading" aria-hidden="true" />}><RFQForm locale={locale} copy={copy} /></Suspense>
    </div></section>
  </main>;
}
