import { AccountBalance } from "@/components/templates/home/account-balance";
import DetailsChart from "@/components/templates/home/details-chart";
import LatestOrders from "@/components/templates/home/latest-orders/index";
import RecentUsers from "@/components/templates/home/recent-users";
import { getAccounts, getCoinsTransfers, getUsersList } from "@/core/actions";
import { useSessionStore } from "@/core/stores/auth.store";
import React from "react";

const HomePage = async () => {
  const transactions = await getCoinsTransfers({ limit: 5, page: 0 });
  const newUsers = await getUsersList({
    params: {
      limit: 20,
      page: 0,
    },
  });
  const accounts = await getAccounts({
    page: 0,
    limit: 20
  })


  return (
    <div className="lg:grid lg:grid-cols-3 p-0! mx-auto space-y-10 gap-5 container">
      <div className="col-span-2 space-y-4  ">
        <DetailsChart accounts={accounts?.data?.length || 0}
          users={newUsers?.data?.length || 0}
          transactions={transactions?.length || 0}
        />
        <LatestOrders transactions={transactions} />
        <RecentUsers users={newUsers?.data} />
      </div>

      <div className="lg:cols-span-1 w-full!">
        <AccountBalance
          balance="$5,000.00"
          brand="موجودی حساب"
          provider="Smart Mob"
          className="w-full!"
        />
      </div>
    </div>
  );
};

export default HomePage;
