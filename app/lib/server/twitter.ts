import { TwitterApi } from "twitter-api-v2";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const TWITTER_SECRET_COOKIE_KEY = "tws";

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
};
