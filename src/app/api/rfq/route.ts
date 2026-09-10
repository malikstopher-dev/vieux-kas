import {NextResponse} from "next/server";
import {env} from "cloudflare:workers";
import {allowedExtensions, allowedMimeTypes, buildMailto, buildMessage, buildReference, escapeHtml, maxFileSize, maxTotalFileSize, type RfqPayload, validateRfq} from "@/lib/rfq";

export const runtime = "nodejs";

function getExtension(name: string) {
  return name.toLowerCase().split(".").pop() ?? "";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const rawPayload = form.get("payload");
    if (typeof rawPayload !== "string" || rawPayload.length > 100_000) return NextResponse.json({status: "error", code: "invalid"}, {status: 400});

    const payload = JSON.parse(rawPayload) as RfqPayload;
    const validationErrors = validateRfq(payload);
    if (validationErrors.length) return NextResponse.json({status: "error", code: validationErrors[0]}, {status: 400});

    const files = form.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const invalidFile = files.some((file) => file.size > maxFileSize || !allowedExtensions.includes(getExtension(file.name) as (typeof allowedExtensions)[number]) || !allowedMimeTypes.has(file.type));
    if (invalidFile || totalSize > maxTotalFileSize) return NextResponse.json({status: "error", code: "file"}, {status: 400});

    const apiKey = env.RESEND_API_KEY;
    const from = env.RFQ_FROM_EMAIL;
    if (!apiKey || !from) {
      console.error("[RFQ] Missing RESEND_API_KEY or RFQ_FROM_EMAIL");
      const mailto = buildMailto(payload);
      return NextResponse.json({status: "fallback", mailto}, {status: 503});
    }

    const recipients = (env.RFQ_RECIPIENTS ?? "info@ak-globaltrading.com").split(",").map((e: string) => e.trim()).filter(Boolean);
    const rows = payload.items.map((item, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.partNumber)}</td><td>${escapeHtml(item.specification)}</td><td>${escapeHtml(item.quantity)} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.notes)}</td></tr>`).join("");
    const details = [
      ["Contact", payload.name], ["Company", payload.company], ["Email", payload.email], ["Telephone", payload.phone],
      ["Country", payload.country], ["Province / Region", payload.province], ["City", payload.city], ["Delivery location", payload.deliveryLocation],
      ["Required date", payload.requiredDate], ["Additional notes", payload.additionalNotes],
    ].map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("");
    const attachments = await Promise.all(files.map(async (file) => ({
      filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"),
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })));

    const subjectName = payload.company || payload.name;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json"},
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: payload.email,
        subject: `New RFQ — ${subjectName} — AKGLOBAL Website`,
        html: `<h1>New RFQ from AKGLOBAL Website</h1>${details}<h2>Requested items</h2><table border="1" cellpadding="8" cellspacing="0"><thead><tr><th>#</th><th>Description</th><th>Part number</th><th>Specification</th><th>Quantity</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table>`,
        attachments,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "unknown");
      console.error(`[RFQ] Resend API error: ${res.status} ${errorBody}`);
      const mailto = buildMailto(payload);
      return NextResponse.json({status: "fallback", mailto}, {status: 503});
    }

    const result = await res.json() as {id?: string};
    console.log(`[RFQ] Resend accepted: id=${result?.id}`);
    return NextResponse.json({status: "success", reference: buildReference()});
  } catch (error) {
    console.error("[RFQ] Server error:", error);
    return NextResponse.json({status: "error", code: "server"}, {status: 400});
  }
}