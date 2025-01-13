import { NextResponse } from "next/server";
import { clearDiscordCookies } from "@/app/lib/server/discord";

export const POST = async () => {
  await clearDiscordCookies();

  return NextResponse.json({ ok: true }, { status: 200 });
};
