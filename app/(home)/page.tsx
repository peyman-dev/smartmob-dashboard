export const dynamic = "force-dynamic";
export const revalidate = 0;

import { AccountBalance } from "@/components/templates/home/account-balance";
import LatestOrders from "@/components/templates/home/latest-orders/index";
import RecentUsers from "@/components/templates/home/recent-users";
import { getAccounts, getOrders, getStatistics, getTransactionHistory, getUsersList } from "@/core/actions";
import { useSessionStore } from "@/core/stores/auth.store";
import { Order } from "@/core/types/types";
import React from "react";
import StatisticsChart from "@/components/templates/home/statistics-chart";

const HomePage = async () => {
  const orders = await getOrders({ limit: 5, page: 0 });
  const newUsers = await getUsersList({
    params: {
      limit: 20,
      page: 0,
    },
  });
    const statistics = await getStatistics() 
  
  // const transactions = await getTransactionHistory({
  //   limit: 20,
  //   page: 0
  // })
  // const accounts = await getAccounts({
  //   page: 0,
  //   limit: 20,
  // });

  return (
    <div className="p-0! mx-auto space-y-10 gap-5 container ">
        <StatisticsChart
          statistics={statistics?.data}
        />
        <LatestOrders orders={orders?.data as Order[]} />
        <RecentUsers users={newUsers?.data} />

     
    </div>
  );
};

export default HomePage;
