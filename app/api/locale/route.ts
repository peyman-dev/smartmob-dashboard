"use server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const { locale } = await req.json();

    await cookieStore.set("locale", locale);

    return NextResponse.json({
      data: locale,
      success: true,
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
};

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value;

    if (!locale)
      return NextResponse.json({
        locale: "en",
      });
    else
      return NextResponse.json({
        locale,
      });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
};
