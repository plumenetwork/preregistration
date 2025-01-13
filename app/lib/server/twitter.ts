import { TwitterApi } from "twitter-api-v2";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const TWITTER_SECRET_COOKIE_KEY = "tws";
export const TWITTER_INFO_COOKIE_KEY = "twi";

export const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export const getCallbackUrl = ({ origin }: { origin: string }) => {
  return `${origin}/api/twitter/callback`;
};

export const getOauthUrl = async ({ callbackUrl }: { callbackUrl: string }) => {
  const { url, codeVerifier } = twitterClient.generateOAuth2AuthLink(
    callbackUrl,
    {
      scope: ["tweet.read", "users.read"],
    }
  );

  const data = await signData({ codeVerifier });

  (await cookies()).set(TWITTER_SECRET_COOKIE_KEY, data, {
    expires: new Date(Date.now() + 1000 * 60 * 10),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });

  return url;
};

export const signData = async <T>(data: T) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  return await new SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
};

export const decodeData = async <T>(token: string): Promise<T> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const { payload } = await jwtVerify(token, secret);

  return payload.data as T;
};

export const getCodeVerifier = async () => {
  const codeVerifiedEncoded = (await cookies()).get(
    TWITTER_SECRET_COOKIE_KEY
  )?.value;

  if (codeVerifiedEncoded) {
    return (await decodeData<{ codeVerifier: string }>(codeVerifiedEncoded))
      .codeVerifier;
  }

  return null;
};

export const oauthLogin = async ({
  code,
  codeVerifier,
  callbackUrl,
}: {
  code: string;
  codeVerifier: string;
  callbackUrl: string;
}) => {
  return await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackUrl,
  });
};

export const clearTwitterCookies = async () => {
  (await cookies()).set(TWITTER_SECRET_COOKIE_KEY, "", {
    expires: new Date(0),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });

  (await cookies()).set(TWITTER_INFO_COOKIE_KEY, "", {
    expires: new Date(0),
    sameSite: "lax",
    secure: true,
    httpOnly: true,
  });
};

export const storeTwitterInfoInCookies = async ({
  tid,
  tname,
  rtname,
}: {
  tid: string | null;
  tname: string | null;
  rtname: string | null;
}) => {
  (await cookies()).set(
    TWITTER_INFO_COOKIE_KEY,
    await signData({
      tid,
      tname,
      rtname,
    }),
    {
      expires: new Date(Date.now() + 1000 * 60 * 10),
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    }
  );
};

export const retrieveTwitterInfoFromCookies = async () => {
  const twitterInfoEncoded = (await cookies()).get(
    TWITTER_INFO_COOKIE_KEY
  )?.value;

  if (twitterInfoEncoded) {
    return (await decodeData(twitterInfoEncoded)) as {
      tid: string | null;
      tname: string | null;
      rtname: string | null;
    };
  }

  return null;
};
