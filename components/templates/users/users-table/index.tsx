"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { User } from "@/core/types/types";
import UserName from "../../home/recent-users/user-card/elements/user-name";
import UserBalance from "../../home/recent-users/user-card/elements/user-balance";
import UserCoins from "./elements/user-coins";
import ModerateUser from "./elements/moderate-user/";
import Image from "next/image";
import { locateImagePath } from "@/core/lib/helpers";
import ProfessionalTable from "@/components/common/professional-table";
import LoadingScreen from "@/components/common/loading-screen";
import SearchUsers from "../search-users";
import { useUserSearchStore } from "../settings/user.search.store";
import CopyToken from "../copy-token";
import Copyable from "@/components/common/copyable";
import { useSearchParams } from "next/navigation";
import { getUsersList } from "@/core/actions";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import useUserFinder from "@/core/hooks/use-user-finder";

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

const UsersTable = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      await getUsersList({
        params: {
          limit: 20,
          page: 0,
        },
      }),
  });
  const { isSearching, searchResult, searchById } = useUserSearchStore();
  const { foundedUsers, isSearchingUser, StopSearchingButton } =
    useUserFinder();
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
          <Copyable
            text={`{follow: ${p.data?.accountInfo.coin?.follow}, other: ${p.data?.accountInfo.coin?.other}}`}
          >
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
      cellRenderer: (p: any) => {
        const isToman = p.data.accountInfo.currency === "TOMAN";
        return (
          <>
            <Image
              className="rounded-full"
              src={
                isToman
                  ? locateImagePath("iran-flag.png")
                  : locateImagePath("usa-flag.png")
              }
              width={24}
              height={24}
              alt=""
            />
            <UserBalance user={p.data} />
          </>
        );
      },
    },
    {
      headerName: gt("common.email"),
      cellRenderer: (p: { data: User }) => (
        <span>
          {p.data.contacts.email.email || " - "}
        </span>
      ),
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

  // const fields: FilterField[] = [
  //   {
  //     label: t("id"),
  //     type: "input",
  //     key: "_id",
  //     defaultValue: filterUserId,
  //   },
  // ];

  if (!data?.data?.length || isLoading) return <LoadingScreen />;
  return (
    <div className=" rounded-2xl">
      <div className="ag-theme-alpine  **:font-estedad!">
        <ProfessionalTable
          HeaderActions={
            <div className="flex items-center gap-2">
              <StopSearchingButton />
              <SearchUsers />
            </div>
          }
          columnDefs={colDefs}
          rowData={
            isSearchingUser
              ? foundedUsers
              : isSearching
              ? searchResult?.data?.data?.length
                ? searchResult?.data?.data
                : []
              : data?.data || []
          }
        />
      </div>
    </div>
  );
};

export default UsersTable;
