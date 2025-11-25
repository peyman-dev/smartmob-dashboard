"use client";
import LoadingScreen from "@/components/common/loading-screen";
import ProfessionalTable from "@/components/common/professional-table";
import SearchOrders from "@/components/templates/orders/search-orders";
import { useSearchStore } from "@/components/templates/orders/search-orders/search.store";
import ModerateOrder from "@/components/templates/orders/table/moderate-order";
import OrderModeTag from "@/components/ui/order-mode-tag";
import { getOrders } from "@/core/actions";
import { localeDate } from "@/core/lib/helpers";
import { Order } from "@/core/types/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

interface IParams {
  data: Order;
}

const ClientPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
  });

  const { searchResult, isSearching, clearSearch } = useSearchStore();


  if (isLoading) return <LoadingScreen />;
  const orders: Order[] =   data?.data;

  const colDefs = [
    {
      headerName: "شناسه سفارش",
      valueGetter: (params: {data: Order}) => params.data._id,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?._id;
      },
    },
    {
      headerName: "کاربر",
      valueGetter: (params: {data: Order}) => params.data.user,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?.target;
      },
    },
    {
      headerName: "هدف",
      valueGetter: (params: {data: Order}) => params.data.target,
      cellRenderer: (param: { data: Order }) => {
        const { data } = param;

        return data?.targetId;
      },
    },
    {
      headerName: "شناسه هدف",
      valueGetter: (params: {data: Order}) => params.data.targetId,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?.target;
      },
    },
    {
      headerName: "تصویر",
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return (
          <div>
            <Image
              // src={(data.img as string) || ""}
              src={""}
              width={32}
              height={32}
              className="rounded-full max-w-8! max-h-8!"
              alt={data._id}
            />
          </div>
        );
      },
    },
    {
      headerName: "مبلغ سفارش",
      valueGetter: (params: {data: Order}) => params.data.price,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?.price;
      },
    },
    {
      headerName: "تعداد تکمیل شده‌ها",
      valueGetter: (params: {data: Order}) => params.data.quantity,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?.quantityComp;
      },
    },
    {
      headerName: "تعداد هنگام شروع",
      valueGetter: (params: {data: Order}) => params.data.quantityComp,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return data?.quantityComp;
      },
    },
    {
      headerName: "نوع سفارش",
      valueGetter: (params: {data: Order}) => params.data.status.code,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return <OrderModeTag mode={data.mode} />;
      },
    },
    {
      headerName: "تاریخ ثبت",
      valueGetter: (params: {data: Order}) => params.data.dateCreate,
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return localeDate(data.dateCreate);
      },
    },
    {
      headerName: "تاریخ آخرین بروزرسانی",
      valueGetter: (params: {data: Order}) => params.data.dateUpdate,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return localeDate(data.dateUpdate);
      },
    },
    {
      headerName: "مدیریت",
      cellRenderer: (param: IParams) => {
        const { data } = param;

        return <ModerateOrder onSuccess={refetch} order={data} />;
      },
    },
  ];

  return (
    <div>
      <ProfessionalTable
        columnDefs={colDefs}
        rowData={isSearching? (searchResult?.data?.data?.length ? searchResult?.data?.data : []) : orders}
        HeaderActions={<SearchOrders />}
      />
    </div>
  );
};

export default ClientPage;
