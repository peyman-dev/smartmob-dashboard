"use client";
export const revalidate = 0;

import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ProfessionalTable from "@/components/common/professional-table";
import LoadingScreen from "@/components/common/loading-screen";
import { getAccounts } from "@/core/actions";
import { Account } from "@/core/types/types";
import useIsEnglish from "@/core/hooks/use-is-english";
import dynamic from "next/dynamic";
import { FilterField } from "@/components/templates/auth/common/filter";
import useUserFinder from "@/core/hooks/use-user-finder";
import { Button } from "antd";
import { localeDate } from "@/core/lib/helpers";
import { FilterX } from "lucide-react";

const Filter = dynamic(
  () => import("@/components/templates/auth/common/filter").then((mod) => mod.default),
  { ssr: false }
);

const PAGE_SIZE = 10;



const AccountsPage = () => {
  const t = useTranslations("accounts");
  const commonT = useTranslations("common");
  const isEN = useIsEnglish();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<{
    isFiltered: boolean;
    filteredItems: Account[];
  }>({ isFiltered: false, filteredItems: [] });

  const {
    foundedUsers,
    isSearchingUser,
    clearAllParams,
    StopSearchingButton,
    navigateToWithUser,
  } = useUserFinder();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<any, Error>({
    queryKey: ["accounts"],
    queryFn: ({ pageParam = 0 }) =>
      getAccounts({ limit: PAGE_SIZE, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      // مهم: فقط وقتی صفحه کامل پر بود، صفحه بعدی رو بده
      if (!lastPage?.data || lastPage.data.length < PAGE_SIZE) {
        return undefined;
      }
      return (lastPage.page || 0) + 1;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000,
    retry: 3,
  });

  const accounts = useMemo(() => {
    return data?.pages.flatMap((p) => p?.data ?? []) ?? [];
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  }, [queryClient]);

  // رفتار دقیقاً مثل صفحه کاربران
  const isFilteredOrSearching = filter.isFiltered || isSearchingUser;
  const enableInfiniteScroll = !isFilteredOrSearching;

  // دیتای نهایی
  const rowData: Account[] = filter.isFiltered
    ? filter.filteredItems
    : isSearchingUser
    ? (foundedUsers as any) // چون foundedUsers نوع User داره ولی ما فقط ID رو می‌خوایم
    : accounts;

  // وقتی کاربر جستجو شده → فقط نتایج کاربر رو نشون بده
  if (isSearchingUser && foundedUsers.length > 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{commonT("searchResults")}</h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {foundedUsers.map((user: any) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium">
                  {user.username || user.phone || user.email || "بدون نام"}
                </p>
                <p className="text-sm text-gray-500">ID: {user._id}</p>
              </div>
              <Button
                type="primary"
                onClick={() => navigateToWithUser("/users", user._id)}
              >
                مشاهده کاربر
              </Button>
            </div>
          ))}
        </div>
        <Button danger onClick={clearAllParams} className="mt-6">
          {commonT("clear")}
        </Button>
      </div>
    );
  }

  if (isLoading && accounts.length === 0) return <LoadingScreen />;

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">خطا در بارگذاری داده‌ها</p>
        <Button type="primary" onClick={handleRetry} className="mt-4">
          تلاش مجدد
        </Button>
      </div>
    );
  }

  const columnDefs = [
    {
      headerName: t("user"),
      cellRenderer: ({ data }: { data: Account }) => (
        <button
          className="text-blue-600 underline hover:text-blue-800 transition-colors"
          onClick={() => navigateToWithUser("/users", data.user)}
        >
          {data?.user || "-"}
        </button>
      ),
    },
    {
      headerName: t("fullName"),
      cellRenderer: ({ data }: { data: Account }) => data?.fullName || "-",
    },
    {
      headerName: t("username"),
      cellRenderer: ({ data }: { data: Account }) =>
        data?.username ? `@${data.username}` : "-",
    },
    {
      headerName: t("numericId"),
      cellRenderer: ({ data }: { data: Account }) => data?.userId || "-",
    },
    {
      headerName: commonT("dateCreate"),
      cellRenderer: ({ data }: { data: Account }) => localeDate(data.dateCreate),
    },
    {
      headerName: commonT("session"),
      cellRenderer: ({ data }: { data: Account }) => data?.sessionId || "-",
    },
    {
      headerName: t("gender"),
      cellRenderer: ({ data }: { data: Account }) =>
        commonT(`gender.${data.gender || "-1"}`),
    },
    {
      headerName: commonT("password"),
      cellRenderer: ({ data }: { data: Account }) => data?.password || "-",
    },
  ];

  const filterFields: FilterField[] = [
    { label: t("filterForm.id.label"), key: "id", type: "input", placeholder: t("filterForm.id.placeholder") },
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
    { label: t("filterForm.isAdmin.label"), key: "isAdmin", type: "boolean" },
  ];

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <ProfessionalTable
        columnDefs={columnDefs}
        rowData={rowData}
        loading={isLoading && accounts.length === 0}
        isFetchingMore={isFetchingNextPage}
        hasMore={enableInfiniteScroll && hasNextPage}
        onLoadMore={loadMore}
        enableInfiniteScroll={enableInfiniteScroll}
        tableTitle={t("title") || "حساب‌های کاربری"}
        noDataMessage={commonT("noData")}
        endMessage={commonT("endOfList")}
        error={isError ? error : null}
        onRetry={handleRetry}
        enableRtl={!isEN}
        scrollHeight="calc(100vh - 180px)"
        rowKey="userId" // یا "_id" — هر چی تو دیتا داری
        className="shadow-lg"
        HeaderActions={
          <div className="flex items-center gap-3">
            {isFilteredOrSearching && (
              <Button
                danger
                icon={<FilterX className="size-4" />}
                onClick={() => {
                  setFilter({ isFiltered: false, filteredItems: [] });
                  clearAllParams?.();
                }}
              >
                {commonT("clear")}
              </Button>
            )}
            <StopSearchingButton />
            <Filter
              onSubmit={() => {
              }}
              fields={filterFields}
            />
          </div>
        }
      />
    </div>
  );
};

export default AccountsPage;