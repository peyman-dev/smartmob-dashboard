"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import LoadingScreen from "@/components/common/loading-screen";
import ProfessionalTable from "@/components/common/professional-table";
import FilterTransfers from "@/components/templates/transfers/filter-transfers";
import { getTransactionHistory } from "@/core/actions";
import useUserFinder from "@/core/hooks/use-user-finder";
import { localeDate } from "@/core/lib/helpers";
import { CoinTransaction } from "@/core/types/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Tag } from "antd";
import { Ellipsis, FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 10;

const ClientPage = () => {
  const t = useTranslations("transfers");
  const cT = useTranslations("common");
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState({
    isFiltered: false,
    filteredItems: [] as CoinTransaction[],
  });

  const {
    foundedUsers,
    clearAllParams,
    isSearchingUser,
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
  } = useInfiniteQuery({
    queryKey: ["coin_transactions"],
    queryFn: ({ pageParam = 0 }) =>
      getTransactionHistory({ page: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length === PAGE_SIZE) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    retry: 3,
  });

  const transactions = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["coin_transactions"] });
  }, [queryClient]);

  // اگر کاربر جستجو کرده → فقط نتایج کاربر نشون بده
  if (isSearchingUser && foundedUsers.length > 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{cT("searchResults")}</h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {foundedUsers.map((user: any) => (
            <div
              key={user._id || user.id}
              className="flex justify-between items-center p-4 border rounded-lg hover:"
            >
              <div>
                <p className="font-medium">
                  {user.username || user.phone || user.email}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {user._id || user.id}
                </p>
              </div>
              <Button
                type="primary"
                onClick={() => navigateToWithUser("/users", user._id || user.id)}
              >
                مشاهده کاربر
              </Button>
            </div>
          ))}
        </div>
        <Button danger onClick={clearAllParams} className="mt-6">
          {cT("clear")}
        </Button>
      </div>
    );
  }

  if (isLoading && transactions.length === 0) return <LoadingScreen />;

  const columnDefs = [
    {
      headerName: t("id"),
      field: "_id",
      width: 180,
      cellRenderer: ({ data }: { data: CoinTransaction }) => (
        <span className="font-mono text-xs">{data._id}</span>
      ),
    },
    {
      headerName: t("sender"),
      cellRenderer: ({ data }: { data: CoinTransaction }) => {
        if (!data.user1) return "نامشخص";
        return (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => navigateToWithUser("/users", data.user1)}
          >
            {data.user1}
          </button>
        );
      },
    },
    {
      headerName: t("receiver"),
      cellRenderer: ({ data }: { data: CoinTransaction }) => {
        if (!data.user2) return "نامشخص";
        return (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => navigateToWithUser("/users", data.user2)}
          >
            {data.user2}
          </button>
        );
      },
    },
    {
      headerName: t("coinType"),
      cellRenderer: ({ data }: { data: CoinTransaction }) => (
        <Tag className="font-estedad">
          {data.coinModel == 0 ? t("followCoin") : t("sharedCoin")}
        </Tag>
      ),
    },
    {
      headerName: t("coinCount"),
      cellRenderer: ({ data }: { data: CoinTransaction }) =>
        `${data.coinNumber} ${t("countSuffix")}`,
    },
    {
      headerName: t("createdAt"),
      cellRenderer: ({ data }: { data: CoinTransaction }) =>
        localeDate(data.dateCreate),
    },
    {
      headerName: t("actions"),
      cellRenderer: () => (
        <button className="rotate-90 text-zinc-500">
          <Ellipsis />
        </button>
      ),
      width: 80,
    },
  ];

  // دیتای نهایی: فیلتر شده یا تراکنش‌های اصلی
  const finalRowData = filter.isFiltered ? filter.filteredItems : transactions;

  return (
    <div className="p-4 min-h-screen ">
      <ProfessionalTable
        HeaderActions={
          <div className="flex items-center gap-3">
            {filter.isFiltered && (
              <Button
                danger
                icon={<FilterX className="size-4" />}
                onClick={() =>
                  setFilter({ isFiltered: false, filteredItems: [] })
                }
              >
                {cT("clear")}
              </Button>
            )}
            <StopSearchingButton />
            <FilterTransfers setFilters={setFilter} />
          </div>
        }
        columnDefs={columnDefs}
        rowData={finalRowData}
        loading={isLoading && transactions.length === 0}
        isFetchingMore={isFetchingNextPage}
        hasMore={hasNextPage}
        onLoadMore={loadMore}
        enableInfiniteScroll={true}
        error={isError ? (error as Error) : null}
        onRetry={handleRetry}
        enableRtl={true}
        scrollHeight="calc(100vh - 180px)"
        rowKey="_id"
        className="shadow-lg"
      />
    </div>
  );
};

export default memo(ClientPage);