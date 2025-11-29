// app/accounts/page.tsx

"use client";
export const revalidate = 0;

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

import ProfessionalTable from "@/components/common/professional-table";
import { getAccount, getAccounts } from "@/core/actions";
import { Account } from "@/core/types/types";
import type { ColDef } from "ag-grid-community";

import Link from "next/link";
import dynamic from "next/dynamic"; // این خط رو فراموش نکن!
import { FilterField } from "@/components/templates/auth/common/filter";
import useUserFinder from "@/core/hooks/use-user-finder";
import { Button } from "antd";

// dynamic import با ssr: false
const Filter = dynamic(
  () => import("@/components/templates/auth/common/filter").then((mod) => mod.default),
  { ssr: false }
);

const AccountsPage = () => {
  const [queries, setQueries] = useState<{
    page?: number;
    limit?: number;
    user?: string;
    username?: string;
  }>({
    page: 0,
    limit: 20,
  });

  const t = useTranslations("accounts");
  const commonT = useTranslations("common");
  const {StopSearchingButton,foundedUsers,isSearchingUser} = useUserFinder()



  const { data, isLoading } = useQuery({
    queryKey: ["accounts", queries],
    queryFn: () => getAccounts(queries),
    placeholderData: keepPreviousData,
  });

  const accounts: Account[] = data?.data ?? [];

  const columnDefs: ColDef<Account>[] = [
    {
      headerName: t("user"),
      flex: 1,
      cellRenderer: ({ data }: { data: Account }) => (
        <p
          // className="underline text-blue-600 hover:text-blue-800"
        >
          {data?.userId || "-"}
        </p>
      ),
    },
    {
      headerName: t("fullName"),
      flex: 1,
      field: "fullName",
    },
    {
      headerName: t("numericId"),
      flex: 1,
      field: "userId",
      getQuickFilterText: (params) => params.value ?? "",
    },
    {
      headerName: t("username"),
      flex: 1,
      field: "username",
      cellRenderer: (params: any) => (params.value ? `@${params.value}` : "-"),
    },
    {
      headerName: t("gender"),
      flex: 1,
      field: "gender",
      cellRenderer: (params: any) => commonT(`gender.${params.value}`),
    },
  ];

  const filterFields: FilterField[] = [
    {
      label: t("filterForm.id.label"),
      key: "id",
      type: "input",
      placeholder: t("filterForm.id.placeholder"),
    },
    {
      label: t("filterForm.status.label"),
      key: "status",
      type: "select",
      options: [
        { label: t("filterForm.status.options.active"), value: "active" },
        { label: t("filterForm.status.options.inactive"), value: "inactive" },
        { label: t("filterForm.status.options.pending"), value: "pending" },
      ],
    },
    {
      label: t("filterForm.isAdmin.label"),
      key: "isAdmin",
      type: "boolean",
    },
  ];

  return (
    <div className="  container">
      <ProfessionalTable
        HeaderActions={<div className="flex items-center gap-2">
          <StopSearchingButton />
          <Filter
            onSubmit={(values) => {
              console.log("فیلتر اعمال شد:", values);
              // بعداً اینجا setQueries رو آپدیت می‌کنی
            }}
            fields={filterFields}
            />
         
            </div>
        }
        columnDefs={columnDefs}
        rowData={isSearchingUser ? foundedUsers as any[] : accounts}
        loading={isLoading}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default AccountsPage;