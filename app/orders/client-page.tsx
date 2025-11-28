"use client";export const dynamic = "force-dynamic";
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
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import Copyable from "@/components/common/copyable";
import { useTranslations } from "next-intl";

interface IParams {
  data: Order;
}

const ClientPage = () => {
  const t = useTranslations("orders");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
  });
  const commonT = useTranslations("common");

  const { searchResult, isSearching } = useSearchStore();

  if (isLoading) return <LoadingScreen />;
  const orders: Order[] = data?.data;

  const colDefs = [
    {
      headerName: t("orderId"),
      valueGetter: (params: { data: Order }) => params.data._id,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return <Copyable text={data?._id}>{data?._id}</Copyable>;
      },
    },
    {
      headerName: t("user"),
      valueGetter: (params: { data: Order }) => params.data.user,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return <Copyable text={data?.user}>{data?.user}</Copyable>;
      },
    },
    {
      headerName: t("target"),
      valueGetter: (params: { data: Order }) => params.data.target,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return <Copyable text={data?.target}>{data?.target}</Copyable>;
      },
    },
    {
      headerName: t("targetId"),
      valueGetter: (params: { data: Order }) => params.data.targetId,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return <Copyable text={data?.targetId}>{data?.targetId}</Copyable>;
      },
    },
    {
      headerName: t("image"),
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return (
          <div>
            <Image
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
      headerName: t("price"),
      valueGetter: (params: { data: Order }) => params.data.price,
      cellRenderer: (param: IParams) => {
        const { data } = param;
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
      headerName: t("quantity"),
      valueGetter: (params: { data: Order }) => params.data.quantity,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return (
          <Copyable text={data?.quantity?.toString()}>
            {data?.quantity}
          </Copyable>
        );
      },
    },
    {
      headerName: t("quantityComp"),
      valueGetter: (params: { data: Order }) => params.data.quantityComp,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return (
          <Copyable text={data?.quantityComp?.toString()}>
            {data?.quantityComp}
          </Copyable>
        );
      },
    },
    // {
    //   headerName: t(""),
    //   valueGetter: (params: { data: Order }) => params.data.quantityComp,
    //   cellRenderer: (param: IParams) => {
    //     const { data } = param;
    //     return (
    //       <Copyable text={data?.quantityComp?.toString()}>
    //         {data?.quantityComp}
    //       </Copyable>
    //     );
    //   },
    // },
    {
      headerName: t("mode"),
      valueGetter: (params: { data: Order }) => params.data.status.code,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        return <OrderModeTag mode={data.mode} />;
      },
    },
    {
      headerName: t("dateCreate"),
      valueGetter: (params: { data: Order }) => params.data.dateCreate,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        const text = localeDate(data.dateCreate);
        return <Copyable text={text}>{text}</Copyable>;
      },
    },
    {
      headerName: t("dateUpdate"),
      valueGetter: (params: { data: Order }) => params.data.dateUpdate,
      cellRenderer: (param: IParams) => {
        const { data } = param;
        const text = localeDate(data.dateUpdate);
        return <Copyable text={text}>{text}</Copyable>;
      },
    },
    {
      headerName: t("manage"),
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
        rowData={
          isSearching
            ? searchResult?.data?.data?.length
              ? searchResult?.data?.data
              : []
            : orders
        }
        HeaderActions={<SearchOrders />}
      />
    </div>
  );
};

export default ClientPage;
