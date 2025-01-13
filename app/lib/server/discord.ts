import DiscordOauth2 from "discord-oauth2";
import crypto from "crypto";
import { cookies } from "next/headers";
import { decodeData, signData } from "./twitter";

const DISCORD_INFO_COOKIE_KEY = "dinfo";

export const getCallbackUrl = ({ origin }: { origin: string }) => {
  return `${origin}/api/discord/callback`;
};

export const getOauthUrl = async ({ callbackUrl }: { callbackUrl: string }) => {
  const oauth = new DiscordOauth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: callbackUrl,
  });

  return oauth.generateAuthUrl({
    scope: ["identify"],
    state: crypto.randomBytes(16).toString("hex"),
  });
};

export const getDiscordUser = async ({
  code,
  callbackUrl,
}: {
  code: string;
  callbackUrl: string;
}) => {
  const oauth = new DiscordOauth2();

  const token = await oauth.tokenRequest({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    code,
    scope: "identify guilds guilds.members.read",
    grantType: "authorization_code",
    redirectUri: callbackUrl,
  });

  return await oauth.getUser(token.access_token);
};

export const clearDiscordCookies = async () => {
  (await cookies()).set(DISCORD_INFO_COOKIE_KEY, "", {
    expires: new Date(0),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
};

export const storeDiscordInfoInCookies = async ({
  did,
  dname,
  rdname,
}: {
  did: string | null;
  dname: string | null;
  rdname: string | null;
}) => {
  (await cookies()).set(
    DISCORD_INFO_COOKIE_KEY,
    await signData({
      did,
      dname,
      rdname,
    }),
    {
      expires: new Date(Date.now() + 1000 * 60 * 10),
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    }
  );
};

export const retrieveDiscordInfoFromCookies = async () => {
  const discordInfoEncoded = (await cookies()).get(
    DISCORD_INFO_COOKIE_KEY
  )?.value;

  if (discordInfoEncoded) {
    return (await decodeData(discordInfoEncoded)) as {
      did: string | null;
      dname: string | null;
      rdname: string | null;
    };
  }

  return null;
};
