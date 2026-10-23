import { NextRequest, NextResponse } from "next/server";

import { isKitchenAuthorized } from "@/lib/kitchen-auth";

export function proxy(request: NextRequest) {
  if (isKitchenAuthorized(request.headers.get("authorization"))) {
    return NextResponse.next();
  }
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Cozinha"' },
  });
}

export const config = {
  matcher: "/:slug/kitchen",
};
