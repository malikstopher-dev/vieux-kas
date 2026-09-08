import Image from "next/image";
import Link from "next/link";
import type {Locale, PageKey, SiteCopy} from "@/lib/site";
import {categoryImages, routeFor} from "@/lib/site";
import {ActionLink} from "./ActionLink";

type Category = SiteCopy["categories"][number];

export function ProductDetailPage({locale, copy, page}: {locale: Locale; copy: SiteCopy; page: PageKey}) {
  const category = copy.categories.find((item) => item.route === page) as Category;
  const params = new URLSearchParams({category: category.title});
  return <main>
    <section className="product-hero"><div className="shell product-hero-grid">
      <div className="product-hero-copy">
        <Link className="back-link" href={routeFor("products", locale)}>← {copy.common.backProducts}</Link>
        <p className="kicker">{copy.productPage.kicker}</p>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
        <ActionLink href={`${routeFor("rfq", locale)}?${params}`}>{copy.common.addRfq}</ActionLink>
      </div>
      <div className="product-hero-image"><Image src={categoryImages[category.key]} alt={category.title} fill priority sizes="(max-width: 767px) 100vw, 55vw" /><span>AK / 0{copy.categories.indexOf(category) + 1}</span></div>
    </div></section>
    <section className="product-scope section-pad"><div className="shell product-scope-grid">
      <div><p className="kicker">{copy.productPage.introLabel}</p><h2>{category.description}</h2></div>
      <div className="product-list"><p>{copy.productPage.listLabel}</p><ul>{category.items.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ul></div>
    </div></section>
    <section className="specification-note"><div className="shell"><span>SPEC / AVAILABILITY / COMMERCIAL TERMS</span><p>{copy.common.specification}</p></div></section>
    <section className="product-rfq section-pad dark-section"><div className="shell note-grid">
      <div><p className="kicker">RFQ / {category.title}</p><h2>{copy.productPage.requestTitle}</h2><p>{copy.productPage.requestBody}</p></div>
      <ActionLink href={`${routeFor("rfq", locale)}?${params}`} variant="light">{copy.common.addRfq}</ActionLink>
    </div></section>
  </main>;
}
