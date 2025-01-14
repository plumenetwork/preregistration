import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { get } from "@vercel/edge-config";

const blockedCountries = [
  "AF", // Afghanistan
  "BY", // Belarus
  "CF", // Central African Republic
  "CU", // Cuba
  "CD", // Democratic Republic of Congo
  "KP", // Democratic People’s Republic of North Korea
  "UA", // Donetsk People's Republic (DNR) region of Ukraine (use Ukraine code)
  "IR", // Islamic Republic of Iran
  "LR", // Liberia
  "MZ", // Mozambique
  "MM", // Myanmar
  "UA", // Luhansk People's Republic (LNR) region of Ukraine (use Ukraine code)
  "RW", // Rwanda
  "SO", // Somalia
  "SS", // South Sudan
  "SD", // Sudan (North)
  "SY", // Syria
  "UG", // Uganda
  "UA", // The Crimea (use Ukraine code)
  "ZW", // Zimbabwe
  "US", // The United States of America
];

export async function middleware(request: NextRequest) {
  const { country } = geolocation(request);

  console.log(`country: ${country}`);

  const isGeoBlockingEnabled = await get("isGeoBlockingEnabled");
  const isUrlRestricted = new URL(request.url).pathname.startsWith(
    "/restricted"
  );
  const isApiUrl = new URL(request.url).pathname.startsWith("/api");
  const isImages = new URL(request.url).pathname.startsWith("/images");

  if (
    !isUrlRestricted &&
    !isImages &&
    isGeoBlockingEnabled &&
    country &&
    blockedCountries.includes(country)
  ) {
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
