"use client";
import useIsEnglish from "@/core/hooks/use-is-english";
import { User } from "@/core/types/types";
import { Tag } from "antd";
import { useTranslations } from "next-intl";
import React from "react";

const UserCoins = ({ user }: { user: User }) => {
  const t = useTranslations("common");
  const isEN = useIsEnglish()
  return (
    <div className="grid! grid-cols-! gap-1 p-0! **:p-! **:m-0! py-1 text-xs!  **:max-h-max!">
      <Tag
        color="green"
        dir={isEN ? "ltr" : "rtl"}
        title={`${user.accountInfo.coin.follow} سکه در قسمت فالو`}
      >
        {t("dynamicCoins", {
          count: user.accountInfo.coin.follow,
          coinType: "follow",
        })}
      </Tag>
      <Tag
        dir={isEN ? "ltr" : "rtl"}
        color="purple" title={`${user.accountInfo.coin.other} سکه در مشترک`}>
        {t("dynamicCoins", {
          count: user.accountInfo.coin.other,
          coinType: "other",
        })}
      </Tag>
    </div>
  );
};

export default UserCoins;
