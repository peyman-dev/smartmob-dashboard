"use client";

import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  ValueGetterParams,
} from "ag-grid-community";
import { User } from "@/core/types/types";
import UserName from "../../home/recent-users/user-card/elements/user-name";
import UserRole from "../../home/recent-users/user-card/elements/user-role";
import JoinDate from "../../home/recent-users/user-card/elements/join-date";
import Currency from "@/components/common/currency";
import UserBalance from "../../home/recent-users/user-card/elements/user-balance";
import UserEmail from "./elements/user-email";
import UserCoins from "./elements/user-coints";
import ModerateUser from "./elements/moderate-user";
import Image from "next/image";
import { locateImagePath } from "@/core/lib/helpers";

ModuleRegistry.registerModules([AllCommunityModule]);

const persianComparator = (a: any, b: any) => {
  return String(a || "").localeCompare(String(b || ""), "fa", {
    sensitivity: "base",
    numeric: true,
  });
};

const UsersTable = ({
  users,
  refetch,
}: {
  users: User[];
  refetch: () => void;
}) => {
  const gridRef = useRef<AgGridReact<User>>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const defaultColDef = useMemo<ColDef<User>>(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    }),
    []
  );

  const colDefs: ColDef<User>[] = [
    { field: "_id", headerName: "شناسه", filter: "agTextColumnFilter" },
    {
      headerName: "پروفایل کاربر",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.name || p.data?.accountInfo.username || "بدون نام",
      cellRenderer: (p: any) => p.data && <UserName user={p.data} />,
      comparator: persianComparator,
    },
    {
      headerName: "نوع حساب",
      valueGetter: (p: ValueGetterParams<User>) => {
        const r = p.data?.roles;
        if (r?.ghost) return "شبح";
        if (r?.manager) return "مدیر";
        if (r?.admin) return "ادمین";
        return "عادی";
      },
      cellRenderer: (p: any) => p.data && <UserRole roles={p.data.roles} />,
      comparator: persianComparator,
    },
    {
      headerName: "موجودی سکه ها",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.coin?.follow ?? 0,
      cellRenderer: (p: any) => p.data && <UserCoins user={p.data} />,
      comparator: (a: any, b: any) => (b ?? 0) - (a ?? 0),
      sort: "desc" as const,
    },
    {
      headerName: "موجودی حساب",
      cellRenderer: (p: any) => p.data && <UserBalance user={p.data} />,
    },
    {
      headerName: "ارز",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.currency === "TOMAN" ? "تومان" : "دلار",
      cellRenderer: (p: any) => {
        if (!p.data) return null;
        const isToman = p.data.accountInfo.currency === "TOMAN";
        return (
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full"
              src={
                isToman
                  ? locateImagePath("iran-flag.png")
                  : locateImagePath("usa-flag.png")
              }
              width={32}
              height={32}
              alt=""
            />
            <span>{isToman ? "تومان" : "دلار"}</span>
          </div>
        );
      },
      comparator: persianComparator,
      filter: "agSetColumnFilter",
      filterParams: { values: ["تومان", "دلار"] },
    },
    {
      headerName: "تاریخ عضویت",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.joinDate ?? 0,
      cellRenderer: (p: any) =>
        p.data && <JoinDate joinTimestamp={p.data.accountInfo.joinDate} />,
      comparator: (_: any, __: any, nodeA: any, nodeB: any) =>
        (nodeA.data?.accountInfo.joinDate ?? 0) -
        (nodeB.data?.accountInfo.joinDate ?? 0),
    },
    {
      headerName: "آخرین بازدید",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.loginDate ?? 0,
      cellRenderer: (p: any) =>
        p.data && <JoinDate joinTimestamp={p.data.accountInfo.loginDate} />,
      comparator: (_: any, __: any, nodeA: any, nodeB: any) =>
        (nodeA.data?.accountInfo.loginDate ?? 0) -
        (nodeB.data?.accountInfo.loginDate ?? 0),
    },
    {
      headerName: "ایمیل",
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.contacts.email.email ?? "",
      cellRenderer: (p: any) =>
        p.data && <UserEmail contacts={p.data.contacts} />,
      comparator: persianComparator,
    },
    {
      headerName: "مدیریت دسترسی کاربر",
      cellRenderer: (p: any) =>
        p.data && <ModerateUser user={p.data} onSuccess={refetch} />,
      sortable: false,
      filter: false,
      floatingFilter: false,
    },
  ];

  return (
    <div className="min-h-[700px] rounded-2xl overflow-hidden">
      <div className="h-24 flex items-center justify-between bg-zinc-50 text-slate-700 rounded-t-lg px-6">
        <h2 className="text-2xl font-bold">لیست کاربران</h2>
       
      </div>

      <div
        dir="rtl"
        className="ag-theme-alpine h-[calc(100vh-200px)] **:font-estedad! **:rounded-t-none!"
      >
        <AgGridReact<User>
          ref={gridRef}
          defaultColDef={defaultColDef}
          enableRtl
          rowHeight={72}
          headerHeight={56}
          rowClass="flex! **:flex! **:gap-1.5 **:items-center! items-center!"
          columnDefs={colDefs}
          rowData={users}
          domLayout="normal"
          pagination
          paginationPageSize={20}
          suppressDragLeaveHidesColumns
          quickFilterText={globalSearch}
          localeText={{
            contains: "شامل",
            notContains: "شامل نشود",
            equals: "مساوی",
            notEqual: "نامساوی",
            startsWith: "شروع با",
            endsWith: "پایان با",
            filterOoo: "فیلتر...",
            noRowsToShow: "داده‌ای یافت نشد",
          }}
        />
      </div>
    </div>
  );
};

export default UsersTable;
