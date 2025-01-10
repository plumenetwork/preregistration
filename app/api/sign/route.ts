import { prisma } from "@/app/lib/server/prisma";
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

  const user = await prisma.user.findFirst({
    where: {
      walletAddress: address,
    },
  });

  if (user) {
    return NextResponse.json({ registered: true }, { status: 200 });
  }

  return NextResponse.json({ registered: false }, { status: 200 });
};
