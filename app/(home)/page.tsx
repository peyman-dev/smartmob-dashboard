import { AccountBalance } from "@/components/templates/home/account-balance";
import LatestOrders from "@/components/templates/home/latest-orders/index";
import React from "react";

const HomePage = () => {
  return (
    <div className="grid grid-cols-3 p-0! mx-auto gap-5 container">
      <div className="col-span-2  ">
        <LatestOrders />
      </div>

      <div className="cols-span-1">
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
