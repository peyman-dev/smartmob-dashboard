"use client";
import LoadingScreen from "@/components/common/loading-screen";
import ProfessionalTable from "@/components/common/professional-table";
import { getTransactionHistory } from "@/core/actions";
import { localeDate } from "@/core/lib/helpers";
import { CoinTransaction } from "@/core/types/types";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";
import { Ellipsis } from "lucide-react";
import React from "react";

const ClientPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["coin_transactions"],
    queryFn: async () => await  getTransactionHistory({
        limit: 20,
        page: 0
    }),
  });

  if (isLoading) <LoadingScreen />;
  const transactions = data?.data;
  console.log(transactions);

  return (
    <>
      <ProfessionalTable
        columnDefs={[
          {
            headerName: "شناسه انتقال",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return p.data._id;
            },
          },
          {
            headerName: "فرستنده",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return p.data.user1;
            },
          },
          {
            headerName: "دریافت کننده",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return p.data.user2;
            },
          },
          {
            headerName: "نوع سکه",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return <Tag className="font-estedad!">
                {p.data?.coinModel == 0 ? "سکه فالو" : "سکه مشترک"}
              </Tag>;
            },
          },

          {
            headerName: "تعداد سکه",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return `${p.data.coinNumber} عدد`;
            },
          },

          {
            headerName: "زمان ایجاد",
            cellRenderer: (p: { data: CoinTransaction }) => {
              return localeDate(p.data.dateCreate);
            },
          },
          {
            headerName: "مدیریت",
            cellRenderer: (p?: {data: CoinTransaction }) => {
                return <button className="rotate-90 text-zinc-500">
                    <Ellipsis />
                </button>
            }
          }
        ]}
        rowData={transactions || []}
      />
    </>
  );
};

export default ClientPage;
