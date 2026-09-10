export const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"] as const;
export const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);
export const maxFileSize = 5 * 1024 * 1024;
export const maxTotalFileSize = 15 * 1024 * 1024;

export type RfqItem = {
  description: string;
  partNumber: string;
  specification: string;
  quantity: string;
  unit: string;
  notes: string;
};

export type RfqPayload = {
  locale: "en" | "fr";
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  deliveryLocation: string;
  requiredDate: string;
  additionalNotes: string;
  consent: boolean;
  website?: string;
  items: RfqItem[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRfq(payload: RfqPayload) {
  const errors: string[] = [];
  if (!payload.name.trim() || !payload.company.trim() || !payload.phone.trim() || !payload.country.trim()) errors.push("required");
  if (!emailPattern.test(payload.email)) errors.push("email");
  if (!payload.consent) errors.push("consent");
  if (!payload.items.length || payload.items.some((item) => !item.description.trim() || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0)) errors.push("item");
  if (payload.website) errors.push("spam");
  return [...new Set(errors)];
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"})[character] ?? character);
}

export function buildReference(date = new Date()) {
  const year = date.getUTCFullYear();
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `AK-RFQ-${year}-${token}`;
}

export function buildMessage(payload: RfqPayload) {
  const itemLines = payload.items.map((item, index) => [
    `ITEM ${index + 1}: ${item.description}`,
    item.partNumber && `Part number: ${item.partNumber}`,
    item.specification && `Specification / Grade: ${item.specification}`,
    `Quantity: ${item.quantity}${item.unit ? ` ${item.unit}` : ""}`,
    item.notes && `Notes: ${item.notes}`,
  ].filter(Boolean).join("\n"));
  return [
    "AKGLOBAL WEBSITE RFQ",
    "",
    `Contact: ${payload.name}`,
    `Company: ${payload.company}`,
    `Email: ${payload.email}`,
    `Telephone: ${payload.phone}`,
    `Country: ${payload.country}`,
    `Province / Region: ${payload.province}`,
    `City: ${payload.city}`,
    `Delivery location: ${payload.deliveryLocation}`,
    "",
    ...itemLines,
    "",
    `Required date: ${payload.requiredDate}`,
    `Additional notes: ${payload.additionalNotes}`,
    "",
    "Please attach supporting documents manually before sending.",
  ].join("\n");
}

export function buildMailto(payload: RfqPayload) {
  const body = buildMessage(payload);
  return `mailto:info@ak-globaltrading.com?subject=${encodeURIComponent(`RFQ — ${payload.company}`)}&body=${encodeURIComponent(body)}`;
}
