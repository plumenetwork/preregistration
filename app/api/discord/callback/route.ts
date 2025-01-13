import { NextRequest, NextResponse } from "next/server";
import {
  getCallbackUrl,
  getDiscordUser,
  storeDiscordInfoInCookies,
} from "@/app/lib/server/discord";
import {
  retrieveTwitterInfoFromCookies,
  signData,
} from "@/app/lib/server/twitter";

export const GET = async (request: NextRequest) => {
  const { code } = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  ) as {
    code: string;
  };

  const url = request.nextUrl.clone();
  const searchParams = new URLSearchParams("");
  url.pathname = "/";
  searchParams.set("step", "twitter");

  const twitterInfo = await retrieveTwitterInfoFromCookies();

  if (twitterInfo?.tid) {
    searchParams.set("tid", twitterInfo.tid);
  }

  if (twitterInfo?.tname) {
    searchParams.set("tname", twitterInfo.tname);
  }

  if (twitterInfo?.rtname) {
    searchParams.set("rtname", twitterInfo.rtname);
  }

  if (!code) {
    searchParams.set("discordError", "true");

    url.search = searchParams.toString();

    return NextResponse.redirect(url.toString(), { status: 302 });
  }

  const callbackUrl = getCallbackUrl({
    origin: request.nextUrl.origin,
  });

  try {
    const user = await getDiscordUser({
      code,
      callbackUrl,
    });

    if (user.id) {
      searchParams.set("did", await signData(user.id));
    }

    if (user.username) {
      searchParams.set(
        "dname",
        await signData(`${user.username}#${user.discriminator}`)
      );
      searchParams.set("rdname", `${user.username}#${user.discriminator}`);
    }

    url.search = searchParams.toString();

    await storeDiscordInfoInCookies({
      did: await signData(user.id),
      dname: await signData(`${user.username}#${user.discriminator}`),
      rdname: `${user.username}#${user.discriminator}`,
    });
  } catch (e) {
    console.error(e);

    searchParams.set("discordError", "true");

    url.search = searchParams.toString();
  }

  return NextResponse.redirect(url.toString(), { status: 302 });
};
