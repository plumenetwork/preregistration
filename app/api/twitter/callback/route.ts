import {
  getCallbackUrl,
  getCodeVerifier,
  oauthLogin,
  signData,
} from "@/app/lib/server/twitter";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { code } = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  ) as {
    code: string;
  };

  const { origin } = new URL(request.url);

  const url = request.nextUrl.clone();
  const searchParams = new URLSearchParams(url.search);
  url.pathname = "/";
  searchParams.delete("state");
  searchParams.delete("code");
  searchParams.set("step", "twitter");

  if (!code) {
    searchParams.set("twitterError", "true");

    url.search = searchParams.toString();

    return NextResponse.redirect(url.toString(), { status: 302 });
  }

  const callbackUrl = getCallbackUrl({ origin });

  const codeVerifier = await getCodeVerifier();

  if (!codeVerifier) {
    searchParams.set("twitterError", "true");

    url.search = searchParams.toString();

    return NextResponse.redirect(url.toString(), { status: 302 });
  }

  try {
    const { client } = await oauthLogin({
      code,
      codeVerifier,
      callbackUrl,
    });

    const { data } = await client.currentUserV2();

    if (data.id || data.username) {
      searchParams.set("tid", await signData(data.id));
      searchParams.set("tname", await signData(data.username));
      searchParams.set("rtname", data.username);
    }

    url.search = searchParams.toString();
  } catch (e) {
    console.error(e);
    searchParams.set("twitterError", "true");

    url.search = searchParams.toString();
  }

  return NextResponse.redirect(url.toString(), { status: 302 });
};
