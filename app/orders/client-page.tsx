"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import LoadingScreen from "@/components/common/loading-screen";
import ProfessionalTable from "@/components/common/professional-table";
import SearchOrders from "@/components/templates/orders/search-orders";
import { useSearchStore } from "@/components/templates/orders/search-orders/search.store";
import ModerateOrder from "@/components/templates/orders/table/moderate-order";
import OrderModeTag from "@/components/ui/order-mode-tag";
import { getOrders } from "@/core/actions";
import { localeDate } from "@/core/lib/helpers";
import { Order } from "@/core/types/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Copyable from "@/components/common/copyable";
import { useTranslations } from "next-intl";
import useUserFinder from "@/core/hooks/use-user-finder";
import { Button, Tooltip } from "antd";
import { memo, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

const ClientPage = () => {
  const t = useTranslations("orders");
  const commonT = useTranslations("common");
  const queryClient = useQueryClient();

  const { foundedUsers, clearAllParams, isSearchingUser, navigateToWithUser } =
    useUserFinder();
  const { searchResult, isSearching, isPendingSearch } = useSearchStore();

  // فقط سفارشات رو از سرور می‌گیریم
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: ({ pageParam = 0 }) =>
      getOrders({ page: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length === PAGE_SIZE) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // فقط سفارشات اصلی
  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  // اگر کاربر در حال جستجوی کاربر هست → جدول سفارشات رو اصلاً نشون نده
  if (isSearchingUser && foundedUsers && foundedUsers.length > 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {commonT("searchResults")}
        </h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {foundedUsers.map((user: any) => (
            <div
              key={user._id || user.id}
              className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
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
                onClick={() =>
                  navigateToWithUser("/users", user._id || user.id)
                }
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

  // اگر لودینگ اولیه و هیچ داده‌ای نداریم
  if (isLoading && orders.length === 0) return <LoadingScreen />;

  // ستون‌های جدول سفارشات
  const colDefs: any = [
    {
      headerName: t("orderId"),
      field: "_id",
      cellRenderer: ({ data }: { data: Order }) => {
        return <Copyable text={data._id}>{data._id}</Copyable>;
      },
      width: 180,
      ellipsis: true,
    },
    {
      headerName: t("user"),
      field: "user",
      cellRenderer: ({ data }: { data: Order }) => (
        <Tooltip title={commonT("searchUser")}>
          <button
            className="underline text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => navigateToWithUser("/users", data.user)}
          >
            {data.user}
          </button>
        </Tooltip>
      ),
    },
    {
      headerName: t("target"),
      field: "target",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={data.target}>{data.target}</Copyable>
      ),
      ellipsis: true,
    },
    {
      headerName: t("targetId"),
      field: "targetId",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={data.targetId}>{data.targetId}</Copyable>
      ),
      ellipsis: true,
    },
    {
      headerName: t("status"),
      cellRenderer: ({ data }: { data: Order }) => {
        return (
          <p
            className={
              "text-xs px-2 py-1.5 text-white text-center max-w-max select-none rounded-lg"
            }
            style={{ backgroundColor: data.status.color }}
          >
            {data.status.text}
          </p>
        );
      },
      ellipsis: true,
    },
    {
      headerName: t("image"),
      field: "img",
      cellRenderer: ({ data }: { data: Order }) => (
        <div className="flex justify-center">
          <Image
            src={data.img || "/placeholder.png"}
            width={40}
            height={40}
            alt="order"
            className="rounded-full object-cover size-10"
          />
        </div>
      ),
      width: 80,
    },
    {
      headerName: t("price"),
      field: "price",
      cellRenderer: ({ data }: { data: Order }) => {
        const model = data.priceModel;
        const text = `${data.price} ${commonT(
          `priceModel.${
            ["USD", "TOMAN", "follow"].includes(model) ? model : "default"
          }`
        )}`;
        return <Copyable text={text}>{text}</Copyable>;
      },
    },
    {
      headerName: t("startNumber"),
      field: "startNumber",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={data.startNumber.toString()}>
          {data.startNumber}
        </Copyable>
      ),
    },
    {
      headerName: t("quantity"),
      field: "quantity",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={data.quantity.toString()}>{data.quantity}</Copyable>
      ),
    },
    {
      headerName: t("quantityComp"),
      field: "quantityComp",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={data.quantityComp.toString()}>
          {data.quantityComp}
        </Copyable>
      ),
    },
    {
      headerName: t("remaining"),
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={(data.quantity - data.quantityComp).toString()}>
          {data.quantity - data.quantityComp} {commonT("amount")}
        </Copyable>
      ),
    },
    {
      headerName: t("mode"),
      field: "mode",
      cellRenderer: ({ data }: { data: Order }) => (
        <OrderModeTag mode={data.mode} />
      ),
    },
    {
      headerName: t("dateCreate"),
      field: "dateCreate",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={localeDate(data.dateCreate)}>
          {localeDate(data.dateCreate)}
        </Copyable>
      ),
    },
    {
      headerName: t("dateUpdate"),
      field: "dateUpdate",
      cellRenderer: ({ data }: { data: Order }) => (
        <Copyable text={localeDate(data.dateUpdate)}>
          {localeDate(data.dateUpdate)}
        </Copyable>
      ),
    },
    {
      headerName: t("manage"),
      cellRenderer: ({ data }: { data: Order }) => (
        <ModerateOrder
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["orders"] })
          }
          order={data}
        />
      ),
      width: 100,
      fixed: "right" as const,
    },
  ];

  if (isPendingSearch) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-zinc-500">
        <p>{commonT("loadingOoo")}</p>
        <Loader2 className="size-5 animate-spin"/>
      </div>
    );
  }

  return (
    <div className="lg:p-4 pb-5 lg:min-h-screen">
      <ProfessionalTable
        columnDefs={colDefs}
        rowData={
          isSearchingUser
            ? foundedUsers
            : isSearching
            ? searchResult?.data?.data?.length
              ? searchResult?.data?.data
              : []
            : orders
        }
        loading={isLoading && orders.length === 0}
        isFetchingMore={isFetchingNextPage}
        hasMore={!isSearching && hasNextPage}
        onLoadMore={loadMore}
        enableInfiniteScroll={!isSearching}
        noDataMessage={t("noData") || "هیچ سفارشی یافت نشد"}
        endMessage={t("endMessage") || commonT("endOfList")}
        tableTitle={t("title") || "سفارشات"}
        error={isError ? (error as Error) : null}
        onRetry={handleRetry}
        enableRtl={true}
        scrollHeight="calc(100vh - 180px)"
        rowKey="_id"
        className="shadow-lg"
        HeaderActions={
          <div className="flex items-center gap-3">
            {isSearchingUser && (
              <Button variant="filled" color="red" onClick={clearAllParams}>
                {commonT("clear")}
              </Button>
            )}
            <SearchOrders />
          </div>
        }
      />
    </div>
  );
};

export default memo(ClientPage);
