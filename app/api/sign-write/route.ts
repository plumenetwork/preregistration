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
    discordEncryptedId,
    discordEncryptedUsername,
    cex,
    cexId,
    cexAddress,
  } = (await req.json()) as {
    message: string;
    signature: Hex;
    address: Address;
    twitterEncryptedId: string | null;
    twitterEncryptedUsername: string | null;
    discordEncryptedId: string | null;
    discordEncryptedUsername: string | null;
    cex: string | null;
    cexId: string | null;
    cexAddress: string | null;
  };

  const recoveredAddress = await recoverMessageAddress({
    message,
    signature,
  });

  let twitterId: string | null = null;
  let twitterUsername: string | null = null;
  let discordId: string | null = null;
  let discordUsername: string | null = null;

  if (twitterEncryptedId) {
    twitterId = await decodeData<string>(twitterEncryptedId);
  }

  if (twitterEncryptedUsername) {
    twitterUsername = await decodeData<string>(twitterEncryptedUsername);
  }

  if (discordEncryptedId) {
    discordId = await decodeData<string>(discordEncryptedId);
  }

  if (discordEncryptedUsername) {
    discordUsername = await decodeData<string>(discordEncryptedUsername);
  }

  // Register the user, also store the signature
  await db
    .insert(users)
    .values({
      walletAddress: address,
      signature,
      twitterId,
      twitterName: twitterUsername,
      discordId,
      discordName: discordUsername,
      cex,
      cexId,
      cexWalletAddress: cexAddress,
    })
    .onConflictDoUpdate({
      target: users.walletAddress,
      set: {
        signature,
        twitterId,
        twitterName: twitterUsername,
        discordId,
        discordName: discordUsername,
        cex,
        cexId,
        cexWalletAddress: cexAddress,
      },
    });

  if (!isAddressEqual(recoveredAddress, address)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
};
