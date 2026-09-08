import type {Locale, SiteCopy} from "@/lib/site";
import {routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";
import {CategoryCard} from "./CategoryCard";
import {InnerHero} from "./InnerHero";

export function ProductsPage({locale, copy}: {locale: Locale; copy: SiteCopy}) {
  return <main>
    <InnerHero kicker={copy.products.kicker} title={copy.products.title} lead={copy.products.lead} />
    <section className="products-listing section-pad offwhite-section"><div className="shell category-grid category-grid-large">
      {copy.categories.map((category, i) => <CategoryCard key={category.key} category={category} locale={locale} index={i} priority={i < 2} />)}
    </div></section>
    <section className="product-note section-pad"><div className="shell note-grid">
      <div><p className="kicker">{locale === "en" ? "RFQ / SOURCING" : "DEVIS / APPROVISIONNEMENT"}</p><h2>{copy.products.noteTitle}</h2><p>{copy.products.noteBody}</p></div>
      <ActionLink href={routeFor("rfq", locale)}>{copy.common.quote}</ActionLink>
    </div></section>
  </main>;
}
