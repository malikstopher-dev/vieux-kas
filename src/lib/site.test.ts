import {describe, expect, it} from "vitest";
import {pageKeys, pageFromPath, resolvePage, routeFor, routes, switchLocalePath} from "./site";

describe("locale routing", () => {
  it("defines unique English and French routes for every page", () => {
    expect(new Set(pageKeys.map((page) => routes[page].en)).size).toBe(pageKeys.length);
    expect(new Set(pageKeys.map((page) => routes[page].fr)).size).toBe(pageKeys.length);
  });

  it("resolves translated product slugs", () => {
    expect(resolvePage("en", ["products", "lifting-equipment"])).toBe("lifting");
    expect(resolvePage("fr", ["produits", "equipements-de-levage"])).toBe("lifting");
  });

  it("switches language while preserving page context", () => {
    expect(switchLocalePath("/en/products/fasteners", "fr")).toBe("/fr/produits/fixations-boulonnerie");
    expect(switchLocalePath("/fr/approvisionnement", "en")).toBe("/en/procurement");
    expect(pageFromPath(routeFor("contact", "fr"))).toBe("contact");
  });
});
