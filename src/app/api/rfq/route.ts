import {NextResponse} from "next/server";
import {allowedExtensions, allowedMimeTypes, buildMailto, buildMessage, buildReference, maxFileSize, maxTotalFileSize, type RfqPayload, validateRfq} from "@/lib/rfq";

export const runtime = "nodejs";

const web3FormsAccessKey = "f5583dec-6166-47ca-8780-86e6213028d9";

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

    let deliveryResponse: Response;
    try {
      deliveryResponse = await fetch("https://api.web3forms.com/submit", {
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
    } catch {
      return NextResponse.json({status: "fallback", mailto}, {status: 503});
    }
    const delivery = await deliveryResponse.json().catch(() => null) as {success?: boolean} | null;
    if (!deliveryResponse.ok || !delivery?.success) return NextResponse.json({status: "fallback", mailto}, {status: 503});

    return NextResponse.json({status: "success", reference: buildReference()});
  } catch {
    return NextResponse.json({status: "error", code: "server"}, {status: 400});
  }
}
