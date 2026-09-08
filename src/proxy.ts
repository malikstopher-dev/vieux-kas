import {NextRequest, NextResponse} from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (pathname !== "/" || PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const saved = request.cookies.get("akglobal-locale")?.value;
  const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const locale = saved === "fr" || saved === "en" ? saved : accepted.startsWith("fr") ? "fr" : "en";
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {matcher: ["/"]};
