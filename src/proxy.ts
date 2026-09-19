import {NextRequest, NextResponse} from "next/server";

const CANONICAL_HOST = "ak-globaltrading.com";
const CANONICAL_PROTOCOL = "https";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function isLocalHostname(hostname: string): boolean {
  return LOCAL_HOSTNAMES.has(hostname);
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = url.hostname;
  const proto = url.protocol.replace(":", "");

  const isLocal = isLocalHostname(host);

  if (!isLocal) {
    const needsCanonicalRedirect = host !== CANONICAL_HOST || proto !== CANONICAL_PROTOCOL;
    if (needsCanonicalRedirect) {
      const targetUrl = new URL(url);
      targetUrl.protocol = `${CANONICAL_PROTOCOL}:`;
      targetUrl.hostname = CANONICAL_HOST;
      targetUrl.port = "";
      return NextResponse.redirect(targetUrl, 308);
    }
  }

  const {pathname, search} = url;
  if (pathname !== "/") return NextResponse.next();
  return NextResponse.redirect(new URL(`/en${search}`, url), 308);
}

export const config = {matcher: ["/", "/:path*"]};
