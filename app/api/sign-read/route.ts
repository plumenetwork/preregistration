import { supabase } from "@/app/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";

export const runtime = "edge";

export const GET = async (req: NextRequest) => {
  const { address } = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as {
    address: Address;
  };

  const users = await supabase
    .from("user")
    .select()
    .filter("walletAddress", "eq", address);

  const firstUser = users.data?.[0];

  if (firstUser && firstUser.cex) {
    return NextResponse.json({ registered: true }, { status: 200 });
  }

  return NextResponse.json({ registered: false }, { status: 200 });
};
