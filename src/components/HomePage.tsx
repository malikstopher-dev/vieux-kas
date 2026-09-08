import Image from "next/image";
import Link from "next/link";
import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {CategoryCard} from "./CategoryCard";
import {ArrowIcon} from "./Icons";
import {SectionHeading} from "./SectionHeading";

export function HomePage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  const industries = copy.industries.items.slice(0, 6);
  return <>
    <main>
      <section className="home-hero">
        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span />{copy.home.heroEyebrow}</p>
            <h1>{copy.home.heroTitle.map((line, i) => <span key={line} className={i > 1 ? "outline-word" : ""}>{line}</span>)}</h1>
            <p className="hero-body">{copy.home.heroBody}</p>
            <div className="hero-actions">
              <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
              <ActionLink href={routeFor("products", locale)} variant="outline">{copy.common.explore}</ActionLink>
            </div>
            <p className="hero-location">Fourways · Sandton · {locale === "en" ? "South Africa" : "Afrique du Sud"}</p>
          </div>
          <div className="hero-visual">
            <Image src="/assets/akglobal/hero/hero-lifting-hook.jpg" alt={locale === "en" ? "Heavy-duty industrial lifting hook and chain" : "Crochet et chaîne de levage industriels"} fill priority fetchPriority="high" sizes="(max-width: 767px) 100vw, 58vw" />
            <div className="hero-visual-overlay" />
            <p className="hero-caption">{copy.home.imageCaption}</p>
            <div className="hero-vertical">{locale === "en" ? "INDUSTRIAL · SUPPLY · PROCUREMENT" : "INDUSTRIE · FOURNITURE · APPROVISIONNEMENT"}</div>
          </div>
        </div>
        <div className="capability-strip shell" aria-label={copy.home.categoriesTitle}>
          {copy.categories.map((category, i) => <Link href={routeFor(category.route, locale)} key={category.key}><span>0{i + 1}</span>{category.title}<ArrowIcon /></Link>)}
        </div>
      </section>

      <section className="supply-intro section-pad">
        <div className="shell supply-layout">
          <SectionHeading kicker={copy.home.supplyKicker} title={copy.home.supplyTitle} body={copy.home.supplyBody} />
          <div className="supply-feature">
            <div className="supply-image"><Image src="/assets/akglobal/categories/fasteners-bolting.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 42vw" /></div>
            <p className="technical-caption">{locale === "en" ? "AK / INDUSTRIAL SUPPLY / SOUTH AFRICA" : "AK / FOURNITURE INDUSTRIELLE / AFRIQUE DU SUD"}</p>
          </div>
        </div>
      </section>

      <section className="geography-section section-pad dark-section">
        <div className="shell geography-grid">
          <SectionHeading kicker={copy.home.geographyKicker} title={copy.home.geographyTitle} body={copy.home.geographyBody} light />
          <div className="route-diagram" aria-label={copy.common.based}>
            <div className="route-place"><span>{copy.home.routeFrom}</span><strong>{locale === "en" ? <>South<br/>Africa</> : <>Afrique<br/>du Sud</>}</strong><small>Fourways · Sandton</small></div>
            <div className="route-line"><i /><span>↔</span><i /></div>
            <div className="route-place align-right"><span>{copy.home.routeTo}</span><strong>{locale === "en" ? <>DR<br/>Congo</> : "RDC"}</strong><small>République démocratique du Congo</small></div>
          </div>
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="shell">
          <SectionHeading kicker={copy.home.processKicker} title={copy.home.processTitle} />
          <ol className="process-grid">
            {copy.home.steps.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong><i /></li>)}
          </ol>
        </div>
      </section>

      <section className="categories-section section-pad offwhite-section">
        <div className="shell">
          <SectionHeading kicker={copy.home.categoriesKicker} title={copy.home.categoriesTitle} />
          <div className="category-grid">{copy.categories.map((category, i) => <CategoryCard key={category.key} category={category} locale={locale} index={i} />)}</div>
        </div>
      </section>

      <section className="why-section section-pad">
        <div className="shell why-grid">
          <SectionHeading kicker={copy.home.whyKicker} title={copy.home.whyTitle} />
          <ol className="reason-list">{copy.home.reasons.map((reason, i) => <li key={reason}><span>0{i + 1}</span><strong>{reason}</strong></li>)}</ol>
        </div>
      </section>

      <section className="industries-preview section-pad">
        <div className="shell">
          <div className="industries-head">
            <SectionHeading kicker={copy.home.industriesKicker} title={copy.home.industriesTitle} light />
            <ActionLink href={routeFor("industries", locale)} variant="light">{copy.common.learnMore}</ActionLink>
          </div>
          <div className="industries-list">{industries.map((industry, i) => <div key={industry}><span>{String(i + 1).padStart(2, "0")}</span><p>{industry}</p></div>)}</div>
        </div>
      </section>

      <section className="corporate-statement">
        <Image src="/assets/akglobal/textures/ak-industrial-dark-texture.jpg" alt="" fill sizes="100vw" />
        <div className="statement-overlay" />
        <div className="shell statement-inner">
          <p>AKGLOBAL TRADING PTY</p>
          <h2>{copy.home.statement.map((line) => <span key={line}>{line}</span>)}</h2>
        </div>
      </section>

      <section className="final-cta section-pad">
        <div className="shell cta-grid">
          <SectionHeading kicker={copy.home.ctaKicker} title={copy.home.ctaTitle} body={copy.home.ctaBody} />
          <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
        </div>
      </section>
    </main>
  </>;
}
