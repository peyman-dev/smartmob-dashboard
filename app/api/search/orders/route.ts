// app/api/search/orders/route.ts
"use server";

import { sendRequest } from "@/core/lib/axios";
import { getSession } from "@/core/utils/session";
import { NextRequest, NextResponse } from "next/server";

type SearchParams = {
  page?: string;
  limit?: string;
  mode?: "0" | "1" | "2";
  status?: "0" | "1" | "2" | "3" | "4";
  user?: string;
  serviceId?: string;
  target?: string;
  targetId?: string;
  dateStart?: string; // timestamp
  dateEnd?: string;   // timestamp
};

export const GET = async (req: NextRequest) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = req.url ? new URL(req.url) : { searchParams: new URLSearchParams() };
  
  // ساختن پارامترها برای ارسال به API اصلی
  const params: Record<string, string> = {};
  
  const mapParam = (key: keyof SearchParams, value?: string) => {
    if (value !== undefined && value !== "") params[key as string] = value;
  };

  mapParam("page", searchParams.get("page") ?? undefined);
  mapParam("limit", searchParams.get("limit") ?? undefined);
  mapParam("mode", searchParams.get("mode") ?? undefined);
  mapParam("status", searchParams.get("status") ?? undefined);
  mapParam("user", searchParams.get("user") ?? undefined);
  mapParam("serviceId", searchParams.get("serviceId") ?? undefined);
  mapParam("target", searchParams.get("target") ?? undefined);
  mapParam("targetId", searchParams.get("targetId") ?? undefined);
  mapParam("dateStart", searchParams.get("dateStart") ?? undefined);
  mapParam("dateEnd", searchParams.get("dateEnd") ?? undefined);

  try {
    const res = await sendRequest.get("/admin/orders_list", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params
    });

    return NextResponse.json({
      ok: true,
      data: res.data,
    });
  } catch (error: any) {
    console.error("Search orders error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.response?.data?.message || error?.message || "خطا در جستجو",
      },
      { status: error?.response?.status || 500 }
    );
  }
};