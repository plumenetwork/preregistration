import { getCallbackUrl, getOauthUrl } from "@/app/lib/server/twitter";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { origin } = new URL(request.url || "");

  const callbackUrl = getCallbackUrl({ origin });

  return NextResponse.json(
    {
      url: await getOauthUrl({ callbackUrl }),
    },
    { status: 200 }
  );
};
