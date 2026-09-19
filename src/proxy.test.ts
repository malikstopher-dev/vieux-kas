import {describe, expect, it} from "vitest";
import {proxy} from "./proxy";
import type {NextRequest} from "next/server";

function createMockNextRequest(urlString: string): NextRequest {
  const url = new URL(urlString);
  const request = new Request(urlString, {headers: {"host": url.hostname}});
  Object.defineProperty(request, "nextUrl", {value: url, writable: true, configurable: true});
  return request as NextRequest;
}

describe("proxy canonical redirects", () => {
  it("redirects HTTP production apex to HTTPS apex preserving path and query", async () => {
    const req = createMockNextRequest("http://ak-globaltrading.com/fr/produits?src=gsc");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ak-globaltrading.com/fr/produits?src=gsc");
  });

  it("redirects HTTP www production to HTTPS apex preserving path and query", async () => {
    const req = createMockNextRequest("http://www.ak-globaltrading.com/en/industries?ref=home");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ak-globaltrading.com/en/industries?ref=home");
  });

  it("redirects HTTPS www production to HTTPS apex preserving path and query", async () => {
    const req = createMockNextRequest("https://www.ak-globaltrading.com/en/about?utm=test");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ak-globaltrading.com/en/about?utm=test");
  });

  it("does not redirect HTTPS production apex", async () => {
    const req = createMockNextRequest("https://ak-globaltrading.com/en/products");
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("redirects localhost root to /en on same origin", async () => {
    const req = createMockNextRequest("http://localhost:3000/");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("http://localhost:3000/en");
  });

  it("does not redirect localhost nested EN route", async () => {
    const req = createMockNextRequest("http://localhost:3000/en/about");
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("does not redirect localhost nested FR route", async () => {
    const req = createMockNextRequest("http://localhost:3000/fr/produits");
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("redirects 127.0.0.1 root to /en on same origin", async () => {
    const req = createMockNextRequest("http://127.0.0.1:3000/");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("http://127.0.0.1:3000/en");
  });

  it("preserves query string on localhost root redirect", async () => {
    const req = createMockNextRequest("http://localhost:3000/?source=gsc");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("http://localhost:3000/en?source=gsc");
  });

  it("preserves query string on production HTTP root redirect (first canonical, then root on next hop)", async () => {
    const req = createMockNextRequest("http://ak-globaltrading.com/?ref=home");
    const res = await proxy(req);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ak-globaltrading.com/?ref=home");
  });
});