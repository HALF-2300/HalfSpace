import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Disable these locales for launch (mixed-language content)
  const m = pathname.match(/^\/(es|zh)(\/.*)?$/);
  if (!m) return NextResponse.next();

  const rest = m[2] ?? "";
  const url = req.nextUrl.clone();

  // Redirect to the same route without the locale prefix (fallback to "/")
  url.pathname = rest.length ? rest : "/";
  url.search = search;

  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: ["/es/:path*", "/zh/:path*"],
};

