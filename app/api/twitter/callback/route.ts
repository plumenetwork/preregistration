import { retrieveDiscordInfoFromCookies } from "@/app/lib/server/discord";
import {
  getCallbackUrl,
  getCodeVerifier,
  oauthLogin,
  signData,
  storeTwitterInfoInCookies,
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
  const searchParams = new URLSearchParams("");
  url.pathname = "/";
  searchParams.set("step", "twitter");
  const discordInfo = await retrieveDiscordInfoFromCookies();

  if (discordInfo?.did) {
    searchParams.set("did", discordInfo.did);
  }

  if (discordInfo?.dname) {
    searchParams.set("dname", discordInfo.dname);
  }

  if (discordInfo?.rdname) {
    searchParams.set("rdname", discordInfo.rdname);
  }

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

      await storeTwitterInfoInCookies({
        tid: await signData(data.id),
        tname: await signData(data.username),
        rtname: data.username,
      });
    }

    url.search = searchParams.toString();
  } catch (e) {
    console.error(e);

    searchParams.set("twitterError", "true");

    url.search = searchParams.toString();
  }

  return NextResponse.redirect(url.toString(), { status: 302 });
};
