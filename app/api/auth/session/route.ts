"use server";
import { decryptSession } from "@/core/utils/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = await cookies();
  const session: string | undefined = cookieStore.get(
    process.env.COOKIE_NAME as string
  )?.value;

  if (!session)
    return NextResponse.json({
      ok: false,
    });

  const response = await decryptSession(session);

  return NextResponse.json({
    ok: true,
    payload: response,
  });
};
