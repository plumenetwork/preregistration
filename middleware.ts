import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function middleware(request: NextRequest) {
  const isBlocked = request.headers.get("X-Unauthorized") === "true";

  const isGeoBlockingEnabled = await get("isGeoBlockingEnabled");
  const isUrlRestricted = new URL(request.url).pathname.startsWith(
    "/restricted"
  );
  const isApiUrl = new URL(request.url).pathname.startsWith("/api");
  const isImages = new URL(request.url).pathname.startsWith("/images");

  if (!isUrlRestricted && !isImages && isGeoBlockingEnabled && isBlocked) {
    if (isApiUrl) {
      return NextResponse.json(
        { error: "This API is restricted in your country" },
        { status: 403 }
      );
    }

    return NextResponse.redirect(new URL("/restricted", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
