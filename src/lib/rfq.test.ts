import {describe, expect, it} from "vitest";
import {buildMailto, buildReference, type RfqPayload, validateRfq} from "./rfq";

const valid: RfqPayload = {
  locale: "en", name: "Buyer", company: "Industrial Co", email: "buyer@example.com", phone: "+243 000 000",
  country: "Democratic Republic of the Congo", province: "Lualaba", city: "Kolwezi", deliveryLocation: "Project site",
  requiredDate: "", additionalNotes: "", consent: true,
  items: [{description: "Hex bolts", partNumber: "", specification: "Grade 8.8", quantity: "250", unit: "pcs", notes: ""}],
};

describe("RFQ validation", () => {
  it("accepts a valid multi-item request", () => {
    expect(validateRfq({...valid, items: [...valid.items, {...valid.items[0], description: "Hex nuts"}]})).toEqual([]);
  });

  it("rejects invalid email and incomplete items", () => {
    expect(validateRfq({...valid, email: "bad", items: [{...valid.items[0], quantity: "0"}]})).toEqual(expect.arrayContaining(["email", "item"]));
  });

  it("builds a mail fallback containing line items", () => {
    const mailto = decodeURIComponent(buildMailto(valid));
    expect(mailto).toContain("mailto:info@ak-globaltrading.com");
    expect(mailto).toContain("Hex bolts");
    expect(mailto).toContain("Industrial Co");
  });

  it("creates references only when explicitly called after delivery", () => {
    expect(buildReference(new Date("2026-09-08T00:00:00Z"))).toMatch(/^AK-RFQ-2026-[A-F0-9]{6}$/);
  });
});
