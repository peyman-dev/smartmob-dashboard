import { User } from "@/core/types/types";
import { Tag } from "antd";
import React from "react";

const UserCoins = ({ user }: { user: User }) => {
  return (
    <div className="flex-col! gap-2! justify-center! p-0! **:p-! **:m-0! py-1 text-xs!  **:max-h-max!">
      <Tag
        color="green"
        title={`${user.accountInfo.coin.follow} سکه در قسمت فالو`}
      >
        {user.accountInfo.coin.follow} سکه فالو
      </Tag>
      <Tag color="purple" title={`${user.accountInfo.coin.other} سکه در مشترک`}>
        {user.accountInfo.coin.other} سکه مشترک
      </Tag>
    </div>
  );
};

export default UserCoins;
