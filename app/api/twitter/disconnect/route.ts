import { clearTwitterCookies } from "@/app/lib/server/twitter";
import { NextResponse } from "next/server";

export const POST = async () => {
  await clearTwitterCookies();

  return NextResponse.json({ ok: true }, { status: 200 });
};
