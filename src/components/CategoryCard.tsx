import Image from "next/image";
import Link from "next/link";
import type {Locale, SiteCopy} from "@/lib/site";
import {categoryImages, routeFor} from "@/lib/site";
import {ArrowIcon} from "./Icons";

type Category = SiteCopy["categories"][number];

export function CategoryCard({category, locale, index, priority = false}: {category: Category; locale: Locale; index: number; priority?: boolean}) {
  return <article className="category-card">
    <Link href={routeFor(category.route, locale)} aria-label={category.title}>
      <div className="category-image">
        <Image src={categoryImages[category.key]} alt="" fill priority={priority} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw" />
        <div className="category-shade" />
      </div>
      <div className="category-copy">
        <span className="category-index">0{index + 1}</span>
        <div><h3>{category.title}</h3><p>{category.short}</p></div>
        <span className="category-arrow"><ArrowIcon /></span>
      </div>
    </Link>
  </article>;
}
