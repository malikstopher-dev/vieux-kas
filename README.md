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
RFQ submissions are delivered to `info@ak-globaltrading.com` through Web3Forms. If the provider cannot accept a submission, the form does not claim success or create a reference; it gives the customer a prepared `mailto:` fallback instead.

## Cloudflare Deployment

Live site: <https://ak-globaltrading.com>
Cloudflare Worker preview: <https://akglobal-trading.malikstopher.workers.dev>

Source repository: <https://github.com/malikstopher-dev/vieux-kas>

This Next.js 16 application uses Cloudflare's vinext adapter. The canonical production domain `https://ak-globaltrading.com` is configured as `NEXT_PUBLIC_SITE_URL` in `wrangler.jsonc` for all SEO metadata, sitemaps, canonical URLs, and hreflang links.

To connect automatic GitHub deployments in Cloudflare:

1. Open the `akglobal-trading` Worker in **Workers & Pages**.
2. Open **Settings**, then **Builds**, and select **Connect**.
3. Authorize the Cloudflare GitHub App and select `malikstopher-dev/vieux-kas`.
4. Use production branch `main` and root directory `/`.
5. Keep the build command as `npm run build`.
6. Keep the deploy command as `npx wrangler deploy`.
7. Keep the version command as `npx wrangler versions upload`.

The GitHub App authorization is a one-time dashboard action. Cloudflare then builds and deploys every push to `main`.
