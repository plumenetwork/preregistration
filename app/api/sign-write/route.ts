import { db } from "@/app/drizzle/drizzle";
import { users } from "@/app/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { Address, Hex, isAddressEqual, recoverMessageAddress } from "viem";

export const POST = async (req: NextRequest) => {
  const { message, signature, address } = (await req.json()) as {
    message: string;
    signature: Hex;
    address: Address;
  };

  const recoveredAddress = await recoverMessageAddress({
    message,
    signature,
  });

  // Register the user
  await db
    .insert(users)
    .values({
      walletAddress: address,
    })
    .onConflictDoNothing();

  if (!isAddressEqual(recoveredAddress, address)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
};
