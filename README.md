# AKGLOBAL Trading Pty

Premium bilingual industrial trading and procurement website for AKGLOBAL TRADING PTY. The application serves English at `/en` and French at `/fr`, with translated slugs, metadata, canonical URLs and `hreflang` links.

## Local Development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:browser
```

## Environment

Copy the variable names from `.env.example` into the selected deployment platform. Never commit their values.

- `NEXT_PUBLIC_SITE_URL`: canonical production origin. Set this first to the Cloudflare live URL, then to the final custom domain when DNS is connected.
- `RESEND_API_KEY`: optional Resend API key for real RFQ email delivery.
- `RFQ_FROM_EMAIL`: sender on a domain verified with the email provider.
- `RFQ_RECIPIENTS`: comma-separated business recipients.

Without the email variables, the RFQ form does not claim success or create a reference. It gives the customer a prepared `mailto:` fallback.

## Cloudflare Deployment

Cloudflare’s current Next.js 16 guidance recommends checking the project with `npx vinext check`, then running `npx vinext init` once the Cloudflare Worker project is ready. The check passes the application structure and imports; `next/font` and `next/image` use vinext’s documented Cloudflare behavior.

Do not hardcode the temporary `workers.dev` URL. Configure `NEXT_PUBLIC_SITE_URL` in Cloudflare for the active public origin, rebuild, and update it when the custom domain becomes canonical.
