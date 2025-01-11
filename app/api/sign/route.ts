import { db } from "@/app/drizzle/drizzle";
import { users } from "@/app/drizzle/schema";
import { eq } from "drizzle-orm";
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

export const GET = async (req: NextRequest) => {
  const { address } = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as {
    address: Address;
  };

  const allUsers = await db
    .select()
    .from(users)
    .where(eq(users.walletAddress, address));

  if (allUsers.length) {
    return NextResponse.json({ registered: true }, { status: 200 });
  }

  return NextResponse.json({ registered: false }, { status: 200 });
};
