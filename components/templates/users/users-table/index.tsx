"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { User } from "@/core/types/types";
import UserName from "../../home/recent-users/user-card/elements/user-name";
import UserBalance from "../../home/recent-users/user-card/elements/user-balance";
import UserCoins from "./elements/user-coints";
import ModerateUser from "./elements/moderate-user/";
import Image from "next/image";
import { locateImagePath } from "@/core/lib/helpers";
import ProfessionalTable from "@/components/common/professional-table";
import LoadingScreen from "@/components/common/loading-screen";
import SearchUsers from "../search-users";
import { useUserSearchStore } from "../settings/user.search.store";
import CopyToken from "../copy-token";
import Copyable from "@/components/common/copyable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useToggle from "@/core/hooks/use-toggle";
import { FilterField } from "../../auth/common/filter";
import { getUserById } from "@/core/actions";
import dynamic from "next/dynamic";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { createTranslator } from "next-intl";

const Filter = dynamic(
  () =>
    import("@/components/templates/auth/common/filter").then(
      (mod) => mod.default
    ),
  {
    ssr: false, // این خط کل مشکل رو حل می‌کنه
  }
);
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
  const { clearSearch, isSearching, searchResult } = useUserSearchStore();
  const [isFiltering, toggle] = useToggle(false);
  const [filterUserId, setFilterUserId] = useState("");
  const params = useSearchParams();
  const t = useTranslations("users");
  const gt = useTranslations();
  const colDefs: ColDef<User>[] = [
    {
      headerName: t("id"),
      cellRenderer: (p: { data: User }) => {
        return <Copyable text={p.data._id}>{p.data._id}</Copyable>;
      },
    },
    {
      cellRenderer: (p: { data: User }) => {
        return <Copyable text={p.data.deviceId}>{p.data.deviceId}</Copyable>;
      },
      headerName: t("deviceId"),
    },
    {
      headerName: t("profile"),
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.name || p.data?.accountInfo.username || "بدون نام",
      cellRenderer: (p: { data: User }) =>
        p.data && (
          <Copyable
            text={
              p.data.personalInfo.name ||
              p.data.accountInfo.username ||
              p.data.accountInfo.name
            }
          >
            <UserName user={p.data} />
          </Copyable>
        ),
      comparator: persianComparator,
    },

    {
      headerName: t("coins"),
      valueGetter: (p: ValueGetterParams<User>) =>
        p.data?.accountInfo.coin?.follow ?? 0,
      cellRenderer: (p: any) =>
        p.data && (
          <Copyable text={`{follow: ${p.data?.accountInfo.coin?.follow}, other: ${p.data?.accountInfo.coin?.other}}`}>
            <UserCoins user={p.data} />
          </Copyable>
        ),
      comparator: (a: any, b: any) => (b ?? 0) - (a ?? 0),
      sort: "desc" as const,
    },
    {
      headerName: t("token"),
      cellRenderer: (p: any) => p.data && <CopyToken user={p.data} />,
    },
    {
      headerName: t("balance"),
      cellRenderer: (p: any) => p.data && <UserBalance user={p.data} />,
    },
    {
      headerName: t("currency"),
      valueGetter: (p: ValueGetterParams<User>) =>
        gt(`common.currency.${p.data?.accountInfo.currency}`),
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
            <span>{gt(`common.currency.${p.data.accountInfo.currency}`)}</span>
          </div>
        );
      },
      comparator: persianComparator,
      filter: "agSetColumnFilter",
    },

    {
      headerName: t("status"),
      cellRenderer: (p: { data: User }) => (
        <span>
          {p.data.accountInfo.status ? t("status_blocked") : t("status_active")}
        </span>
      ),
    },
    {
      headerName: t("manage"),
      cellRenderer: (p: any) =>
        p.data && <ModerateUser user={p.data} onSuccess={refetch} />,
      sortable: false,
      filter: false,
      floatingFilter: false,
    },
  ];
  const path = usePathname();
  const paramsIsFiltering = params.get("isFiltering");
  const paramsFilterUserId = params.get("_id") || "";
  const getFilterParams = () => {
    const isFiltering = params.get("isFiltering");
    const filterUserId = params.get("_id") || "";

    setFilterUserId(filterUserId as string);

    if (Number(isFiltering)) {
      toggle(true);
    } else {
      toggle(false);
    }
  };

  const fields: FilterField[] = [
    {
      label: t("id"),
      type: "input",
      key: "_id",
      defaultValue: filterUserId,
    },
  ];

  useEffect(() => {
    getFilterParams();
    return () => {};
  }, [paramsIsFiltering, paramsFilterUserId, path]);

  if (!users?.length) return <LoadingScreen />;
  return (
    <div className=" rounded-2xl">
      <div className="ag-theme-alpine  **:font-estedad! **:rounded-t-none!">
        <ProfessionalTable
          HeaderActions={
            <div className="flex items-center gap-2">
              <SearchUsers />
              <Filter
                fields={fields}
                defaultOpen={isFiltering}
                onSubmit={async (values) => {
                  console.log(values._id);
                  const res = await getUserById(values?._id);
                  console.log(res);
                }}
              />
            </div>
          }
          columnDefs={colDefs}
          rowData={
            isSearching
              ? searchResult?.data?.data?.length
                ? searchResult?.data?.data
                : []
              : users || []
          }
        />
      </div>
    </div>
  );
};

export default UsersTable;
