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
import { useQuery } from "@tanstack/react-query";
import { Button, Tag } from "antd";
import { Ellipsis, FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";

const ClientPage = () => {
  const [filter, setFilter] = useState({
    isFiltered: false,
    filteredItems: [],
  });
  const {
    isSearchingUser,
    StopSearchingButton,
    foundedUsers,
    navigateToWithUser,
  } = useUserFinder();
  const { data, isLoading } = useQuery({
    queryKey: ["coin_transactions"],
    queryFn: async () =>
      await getTransactionHistory({
        limit: 20,
        page: 0,
      }),
  });
  const t = useTranslations("transfers");
  const cT = useTranslations("common");
  if (isLoading) return <LoadingScreen />;
  const transactions = data?.data;

  return (
    <>
      <ProfessionalTable
        HeaderActions={
          <div className="flex items-center gap-3">
            {filter.isFiltered && (
              <Button
                color="red"
                variant="filled"
                icon={<FilterX className="size-4"/>}
                onClick={() => {
                  setFilter({
                    filteredItems: [],
                    isFiltered: false,
                  });
                }}
              >
                {cT("clear")}
              </Button>
            )}
            <StopSearchingButton />
            <FilterTransfers setFilters={setFilter} />
          </div>
        }
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
                <button
                  className="text-blue-600 cursor-pointer underline"
                  onClick={() => navigateToWithUser("/users", p.data.user1)}
                >
                  {p.data.user1}
                </button>
              );
            },
          },
          {
            headerName: t("receiver"),
            cellRenderer: (p: { data: CoinTransaction }) => {
              const userId = p.data.user2 || p.data.user2;
              if (!userId) return "نامشخص";

              return (
                <button
                  className="text-blue-600 cursor-pointer underline"
                  onClick={() => navigateToWithUser("/users", p.data.user2)}
                >
                  {p.data.user2 || p.data.user2 || p.data.user2 || userId}
                </button>
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
              `${p.data.coinNumber} ${t("countSuffix")}`,
          },
          {
            headerName: t("createdAt"),
            cellRenderer: (p: { data: CoinTransaction }) =>
              localeDate(p.data.dateCreate),
          },

          {
            headerName: t("actions"),
            cellRenderer: () => (
              <button className="rotate-90 text-zinc-500">
                <Ellipsis />
              </button>
            ),
          },
        ]}
        rowData={
          filter.isFiltered
            ? filter?.filteredItems || []
            : isSearchingUser
            ? foundedUsers
            : transactions || []
        }
      />
    </>
  );
};

export default ClientPage;
