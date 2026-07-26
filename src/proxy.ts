import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optional HTTP Basic Auth gate for internal/preview deployments.
 *
 * Next.js 16 renamed the `middleware` convention to `proxy`.
 *
 * Enabled only when SITE_PASSWORD is set, so local development and any future
 * public launch are unaffected. Set SITE_USERNAME to change the username
 * (defaults to "team").
 *
 * Hosting platforms generally put password protection behind a paid plan, so
 * this keeps an internal-only deployment private at no cost.
 */
export default function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const expectedUser = process.env.SITE_USERNAME || "team";
  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const separator = decoded.indexOf(":");
    const user = separator === -1 ? "" : decoded.slice(0, separator);
    const pass = separator === -1 ? "" : decoded.slice(separator + 1);

    if (user === expectedUser && pass === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Marton Road MOT Centre", charset="UTF-8"',
    },
  });
}

export const config = {
  // Everything except Next.js internals and static image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
