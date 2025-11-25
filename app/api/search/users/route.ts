"use server";

import { sendRequest } from "@/core/lib/axios";
import { getSession } from "@/core/utils/session";
import { NextRequest, NextResponse } from "next/server";

type SearchParams = {
  page?: string;
  limit?: string;
  status?: "0" | "1";
  deviceId?: string;
  account?: string;
};

export const GET = async (req: NextRequest) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const params: Record<string, string> = {};
  const mapParam = (key: keyof SearchParams, value?: string | null) => {
    if (value && value.trim() !== "") params[key as string] = value.trim();
  };

  mapParam("page", searchParams.get("page") ?? undefined);
  mapParam("limit", searchParams.get("limit") ?? undefined);
  mapParam("status", searchParams.get("status") ?? undefined);
  mapParam("deviceId", searchParams.get("deviceId") ?? undefined);
  mapParam("account", searchParams.get("account") ?? undefined);

  try {
    const res = await sendRequest.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params,
    });

    return NextResponse.json({
      ok: true,
      data: res.data,
    });
  } catch (error: any) {
    console.error("Search users error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.response?.data?.message || error?.message || "خطا در جستجوی کاربران",
      },
      { status: error?.response?.status || 500 }
    );
  }
};