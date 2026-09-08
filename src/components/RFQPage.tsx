import {Suspense} from "react";
import type {Locale, SiteCopy} from "@/lib/site";
import {RFQForm} from "./RFQForm";

export function RFQPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <section className="rfq-hero"><div className="shell rfq-hero-grid"><div><p className="kicker">{copy.rfq.kicker}</p><h1>{copy.rfq.title}</h1></div><p>{copy.rfq.lead}</p></div></section>
    <section className="rfq-section section-pad"><div className="shell rfq-layout">
      <aside><p className="technical-caption">AK / RFQ / {new Date().getFullYear()}</p><h2>{copy.common.based}</h2><p>{copy.common.specification}</p><div className="aside-rule" /></aside>
      <Suspense fallback={<div className="rfq-loading" aria-hidden="true" />}><RFQForm locale={locale} copy={copy} /></Suspense>
    </div></section>
  </main>;
}
