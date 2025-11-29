"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import LoadingScreen from "@/components/common/loading-screen";
import ProfessionalTable from "@/components/common/professional-table";
import { getTransactionHistory } from "@/core/actions";
import useUserFinder from "@/core/hooks/use-user-finder";
import { localeDate } from "@/core/lib/helpers";
import { CoinTransaction } from "@/core/types/types";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";
import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const ClientPage = () => {
  const {} = useUserFinder()
  const { data, isLoading } = useQuery({
    queryKey: ["coin_transactions"],
    queryFn: async () =>
      await getTransactionHistory({
        limit: 20,
        page: 0,
      }),
  });

  if (isLoading) <LoadingScreen />;
  const transactions = data?.data;
  const t = useTranslations("transfers");

  return (
    <>
      <ProfessionalTable
        columnDefs={[
          {
            headerName: t("id"),
            cellRenderer: (p: { data: CoinTransaction }) => {
              return p.data._id;
            },
          },
          {
            headerName: t("sender"),
            cellRenderer: (p: { data: CoinTransaction }) => {
              const userId = p.data.user1;
              if (!userId) return "نامشخص";

              return (
                <Link
                  href={`users?isFiltering=true&_id=${p?.data.user1} `}
                  className="text-blue-600 hover:underline"
                >
                  {p.data.user1}
                </Link>
              );
            },
          },
          {
            headerName: t("receiver"),
            cellRenderer: (p: { data: CoinTransaction }) => {
              const userId = p.data.user2 || p.data.user2;
              if (!userId) return "نامشخص";

              return (
                <Link
                  href={`/users?isFiltering=true&_id=${p?.data.user2}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.data.user2 || p.data.user2 || p.data.user2 || userId}
                </Link>
              );
            },
          },
          {
            headerName: t("coinType"),
            cellRenderer: (p: { data: CoinTransaction }) => {
              return (
                <Tag className="font-estedad!">
                {p.data.coinModel == 0 ? t("followCoin") : t("sharedCoin")}
              </Tag>
              );
            },
          },

          {
            headerName: t("coinCount"),
            cellRenderer: (p: { data: CoinTransaction }) =>
              `${p.data.coinNumber} ${t("countSuffix")}`
          },
          {
            headerName: t("createdAt"),
            cellRenderer: (p: { data: CoinTransaction }) =>
              localeDate(p.data.dateCreate)
          },
      
          {
            headerName: t("actions"),
            cellRenderer: () => (
              <button className="rotate-90 text-zinc-500">
                <Ellipsis />
              </button>
            )
          }
        ]}
        rowData={transactions || []}
      />
    </>
  );
};

export default ClientPage;
