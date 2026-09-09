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
npm run build:next
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

Live Worker: <https://akglobal-trading.malikstopher.workers.dev>

Source repository: <https://github.com/malikstopher-dev/vieux-kas>

This Next.js 16 application uses Cloudflare's vinext adapter. The current `workers.dev` address is configured as `NEXT_PUBLIC_SITE_URL` in `wrangler.jsonc`. Replace that value with the custom domain when it becomes canonical, then rebuild and deploy.

To connect automatic GitHub deployments in Cloudflare:

1. Open the `akglobal-trading` Worker in **Workers & Pages**.
2. Open **Settings**, then **Builds**, and select **Connect**.
3. Authorize the Cloudflare GitHub App and select `malikstopher-dev/vieux-kas`.
4. Use production branch `main` and root directory `/`.
5. Keep the build command as `npm run build`.
6. Keep the deploy command as `npx wrangler deploy`.
7. Keep the version command as `npx wrangler versions upload`.

The GitHub App authorization is a one-time dashboard action. Cloudflare then builds and deploys every push to `main`.
