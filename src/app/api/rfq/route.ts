import {NextResponse} from "next/server";
import {allowedExtensions, allowedMimeTypes, buildMailto, buildMessage, buildReference, escapeHtml, maxFileSize, maxTotalFileSize, type RfqPayload, validateRfq} from "@/lib/rfq";

export const runtime = "nodejs";

const web3FormsAccessKey = "f5583dec-6166-47ca-8780-86e6213028d9";

function getExtension(name: string) {
  return name.toLowerCase().split(".").pop() ?? "";
}

async function tryWeb3Forms(submission: FormData): Promise<{ok: boolean; mailto?: string}> {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: submission,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://ak-globaltrading.com",
        "Referer": "https://ak-globaltrading.com/fr/devis",
      },
    });
    const data = await res.json().catch(() => null) as {success?: boolean} | null;
    return {ok: res.ok && !!data?.success};
  } catch {
    return {ok: false};
  }
}

async function tryResend(payload: RfqPayload, files: File[], mailto: string): Promise<{ok: boolean; reference?: string}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RFQ_FROM_EMAIL;
  if (!apiKey || !from) return {ok: false};

  const recipients = (process.env.RFQ_RECIPIENTS ?? "info@ak-globaltrading.com").split(",").map((e) => e.trim()).filter(Boolean);
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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json"},
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: payload.email,
        subject: `AKGLOBAL RFQ — ${payload.company}`,
        html: `<h1>AKGLOBAL website RFQ</h1>${details}<h2>Requested items</h2><table border="1" cellpadding="8" cellspacing="0"><thead><tr><th>#</th><th>Description</th><th>Part number</th><th>Specification</th><th>Quantity</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table>`,
        attachments,
      }),
    });
    if (res.ok) return {ok: true, reference: buildReference()};
    return {ok: false};
  } catch {
    return {ok: false};
  }
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

    const mailto = buildMailto(payload);
    const submission = new FormData();
    submission.set("access_key", web3FormsAccessKey);
    submission.set("subject", `AKGLOBAL RFQ — ${payload.company}`);
    submission.set("from_name", "AKGLOBAL Trading Website");
    submission.set("replyto", payload.email);
    submission.set("name", payload.name);
    submission.set("email", payload.email);
    submission.set("message", buildMessage(payload));
    files.forEach((file, index) => submission.append(`attachment_${index + 1}`, file, file.name.replace(/[^a-zA-Z0-9._-]/g, "_")));

    // Try Web3Forms first
    const web3Result = await tryWeb3Forms(submission);
    if (web3Result.ok) return NextResponse.json({status: "success", reference: buildReference()});

    // Try Resend if configured
    const resendResult = await tryResend(payload, files, mailto);
    if (resendResult.ok) return NextResponse.json({status: "success", reference: resendResult.reference!});

    // Final fallback: mailto
    return NextResponse.json({status: "fallback", mailto}, {status: 503});
  } catch {
    return NextResponse.json({status: "error", code: "server"}, {status: 400});
  }
}