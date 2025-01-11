import { db } from "@/app/drizzle/drizzle";
import { users } from "@/app/drizzle/schema";
import { decodeData } from "@/app/lib/server/twitter";
import { NextRequest, NextResponse } from "next/server";
import { Address, Hex, isAddressEqual, recoverMessageAddress } from "viem";

export const POST = async (req: NextRequest) => {
  const {
    message,
    signature,
    address,
    twitterEncryptedId,
    twitterEncryptedUsername,
  } = (await req.json()) as {
    message: string;
    signature: Hex;
    address: Address;
    twitterEncryptedId: string | null;
    twitterEncryptedUsername: string | null;
  };

  const recoveredAddress = await recoverMessageAddress({
    message,
    signature,
  });

  let twitterId: string | null = null;
  let twitterUsername: string | null = null;

  if (twitterEncryptedId) {
    twitterId = await decodeData<string>(twitterEncryptedId);
  }

  if (twitterEncryptedUsername) {
    twitterUsername = await decodeData<string>(twitterEncryptedUsername);
  }

  // Register the user, also store the signature
  await db
    .insert(users)
    .values({
      walletAddress: address,
      signature,
      twitterId,
      twitterName: twitterUsername,
    })
    .onConflictDoNothing();

  if (!isAddressEqual(recoveredAddress, address)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
};
