"use client";

import ProfessionalTable from "@/components/common/professional-table";
import { getAccounts } from "@/core/actions";
import { Account } from "@/core/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { ColDef } from "ag-grid-community"; // یا هر لایبرری که ProfessionalTable استفاده می‌کنه
import { localeDate } from "@/core/lib/helpers";
import { Button } from "antd";
import Link from "next/link";
import { FilterField } from "@/components/templates/auth/common/filter";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// حالا Filter رو dynamic ایمپورت کن
const Filter = dynamic(
  () =>
    import("@/components/templates/auth/common/filter").then(
      (mod) => mod.default
    ),
  {
    ssr: false, // این خط کل مشکل رو حل می‌کنه
  }
);
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
  const accountsT = useTranslations("accounts");
  const commonT = useTranslations("common");
  const { data, isLoading } = useQuery({
    queryKey: ["accounts", queries],
    queryFn: () => getAccounts(queries),
    placeholderData: keepPreviousData,
  });

  const accounts: Account[] = data?.data ?? [];

  const columnDefs: ColDef<Account>[] = [
    {
      headerName: accountsT("user"),
      flex: 1,
      cellRenderer: (p: { data: Account }) => {
        return (
          <Link
            href={`/users?isFiltering=1&_id=${p.data._id}`}
            className="underline"
          >
            {p.data?.user}
          </Link>
        );
      },
    },
    {
      headerName: accountsT("fullName"),
      flex: 1,
      field: "fullName",
    },
    {
      headerName: accountsT("numericId"),
      flex: 1,
      field: "userId",
      getQuickFilterText: (params: any) => params.value ?? "", // ← این خط حیاتیه
    },
    {
      headerName: accountsT("username"),
      flex: 1,

      field: "username",
      cellRenderer: (params: any) => (params.value ? `@${params.value}` : "-"),
    },
    {
      headerName: accountsT("gender"),
      flex: 1,

      field: "gender",
      cellRenderer: (params: any) => commonT(`gender.${params.value}`),
    },
  ];
  const filterFields: FilterField[] = [
    {
      label: accountsT("filterForm.id.label"),
      key: "id",
      type: "input",
      placeholder:accountsT("filterForm.id.placeholder"),
    },
    {
      label: accountsT("filterForm.status.label"),
      key: "status",
      type: "select",
      options: [
        { label: accountsT("filterForm.status.options.active"), value: "active" },
        { label:  accountsT("filterForm.status.options.inactive"), value: "inactive" },
        { label:  accountsT("filterForm.status.options.pending"), value: "pending" },
      ],
    },
    {
      label:  accountsT("filterForm.isAdmin.label"),
      key: "isAdmin",
      type: "boolean",
    },
  ];

  return (
    <div className="p-4">
      <ProfessionalTable
        HeaderActions={
          <Filter
            onSubmit={(values) => {
              console.log(values);
            }}
            fields={filterFields}
          />
        }
        columnDefs={columnDefs}
        rowData={accounts}
        loading={isLoading}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default ClientPage;
