import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (pathname !== "/") return NextResponse.next();
  return NextResponse.redirect(new URL("/en", request.url), 308);
}

export const config = {matcher: ["/"]};
