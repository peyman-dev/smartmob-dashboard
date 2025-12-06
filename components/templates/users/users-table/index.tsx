"use client";

import { useCallback, useMemo } from "react";
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
import { getUsersList } from "@/core/actions";
import { useTranslations } from "next-intl";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useUserFinder from "@/core/hooks/use-user-finder";
import useIsEnglish from "@/core/hooks/use-is-english";

const persianComparator = (a: any, b: any) => {
  return String(a || "").localeCompare(String(b || ""), "fa", {
    sensitivity: "base",
    numeric: true,
  });
};

const PAGE_SIZE = 20;

const UsersTable = () => {
  const isEN = useIsEnglish()
  const t = useTranslations("users");
  const gt = useTranslations();
  const queryClient = useQueryClient();

  const { isSearching, searchResult } = useUserSearchStore();
  const { foundedUsers, isSearchingUser, StopSearchingButton } =
    useUserFinder();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: ({ pageParam = 0 }) =>
        getUsersList({
          params: {
            limit: PAGE_SIZE,
            page: pageParam as number,
          },
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage?.data || lastPage.data.length < PAGE_SIZE)
          return undefined;
        return (lastPage.page || 0) + 1;
      },
      initialPageParam: 0,
      staleTime: 60 * 1000,
    });

  const users = useMemo(() => {
    return data?.pages.flatMap((p) => p?.data ?? []) ?? [];
  }, [data]);

  console.log(users)

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const colDefs: any = [
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
      valueGetter: (p: any) =>
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
      valueGetter: (p: any) => p.data?.accountInfo.coin?.follow ?? 0,
      cellRenderer: (p: any) =>
        p.data && (
          <Copyable
            className="flex! *:flex! *:flex-col! flex-col!"
            text={`{follow: ${p.data?.accountInfo.coin?.follow}, other: ${p.data?.accountInfo.coin?.other}}`}
          >
            <div className="grid! grid-cols-! flex-col!">
              <UserCoins user={p.data} />
            </div>
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
          <div dir={isEN ? "ltr" : "rtl"} className="flex items-center!">
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
          </div>
        );
      },
    },
    {
      headerName: gt("common.email"),
      cellRenderer: (p: { data: User }) => (
        <span>{p.data.contacts.email.email || " - "}</span>
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
        p.data && (
          <ModerateUser
            user={p.data}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["users"] })
            }
          />
        ),
      sortable: false,
      filter: false,
      floatingFilter: false,
    },
  ];

  if (isLoading && users.length === 0) return <LoadingScreen />;

  const rowData = isSearchingUser
    ? foundedUsers
    : isSearching
    ? searchResult?.data?.data ?? []
    : users;

  const enableInfiniteScroll = !isSearching && !isSearchingUser;

  return (
    <div className="rounded-2xl">
      <div className="ag-theme-alpine **:font-estedad!">
        <ProfessionalTable
          HeaderActions={
            <div className="flex items-center gap-2">
              <StopSearchingButton />
              <SearchUsers />
            </div>
          }
          columnDefs={colDefs}
          rowData={rowData}
          loading={isLoading && users.length === 0}
          isFetchingMore={isFetchingNextPage}
          hasMore={enableInfiniteScroll && hasNextPage}
          onLoadMore={loadMore}
          enableInfiniteScroll={enableInfiniteScroll}
        />
      </div>
    </div>
  );
};

export default UsersTable;
