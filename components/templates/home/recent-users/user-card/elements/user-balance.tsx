import Currency from "@/components/common/currency";
import { User } from "@/core/types/types";
import { DollarSign } from "lucide-react";
import React from "react";

const UserBalance = ({ user }: { user: User }) => {
  const { money, currency } = user.accountInfo;
  const normilizeThePrice = (price: number) => Math.floor(price)
   return (
    <div className="gap-1!">
        <DollarSign className="size-4"/>
      <span>{currency == "TOMAN" ? normilizeThePrice(money.TOMAN) : normilizeThePrice(money.USD)}</span>
      <Currency className="text-gray-500" currency={currency}/>
    </div>
  );
};

export default UserBalance;
