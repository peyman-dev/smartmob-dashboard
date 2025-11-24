"use client";

import ProfessionalTable from "@/components/common/professional-table";
import { getAccounts } from "@/core/actions";
import { Account } from "@/core/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { ColDef } from "ag-grid-community"; // یا هر لایبرری که ProfessionalTable استفاده می‌کنه
import { localeDate } from "@/core/lib/helpers";

const ClientPage = () => {
  const [queries, setQueries] = useState<{
    page?: number;
    limit?: number;
    user?: string;
    username?: string;
  }>({
    page: 0,
    limit: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", queries],
    queryFn: () => getAccounts(queries),
    placeholderData: keepPreviousData,
  });

  const accounts: Account[] = data?.data ?? [];

  // ستون‌ها کاملاً تایپ‌سیف با Account
  const columnDefs: ColDef<Account>[] = [
    {
      headerName: "شناسه دیتابیس",
      field: "_id",
      width: 220,
      filter: true,
    },
    {
      headerName: "نام کامل",
      field: "fullName",
      flex: 1,
      minWidth: 120,
    },
    {
        headerName: "آیدی عددی",
        field: "userId",
        width: 140,
        filter: "agTextColumnFilter",  // ← عوضش کن از agNumberColumnFilter به agTextColumnFilter
        getQuickFilterText: (params: any) => params.value ?? "", // ← این خط حیاتیه
      },
    {
      headerName: "یوزرنیم",
      field: "username",
      width: 160,
      cellRenderer: (params: any) => (params.value ? `@${params.value}` : "-"),
    },
    {
      headerName: "جنسیت",
      field: "gender",
      width: 100,
      cellRenderer: (params: any) => {
        if (params.value === 1) return "مرد";
        if (params.value === 0) return "زن";
        return "نامشخص";
      },
    },
    {
      headerName: "تاریخ ساخت",
      field: "dateCreate",
      width: 150,
      valueFormatter: (params: any) =>
        // new Date(params.value * 1000).toLocaleDateString("fa-IR"),
      localeDate(params.value)
    },
    {
      headerName: "سشن",
      width: 110,
      cellRenderer: (params: any) => (params.data.sessionId ? "موجود" : "خالی"),
    },
  ];

  return (
    <div className="p-4">
      <ProfessionalTable
        columnDefs={columnDefs}
        rowData={accounts}
        loading={isLoading}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default ClientPage;
