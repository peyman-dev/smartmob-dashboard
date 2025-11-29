"use client";
import { Tag } from "antd";
import { useTranslations } from "next-intl";
import React from "react";
import { tv } from "tailwind-variants";

const OrderModeTag = ({ mode }: { mode: number }) => {
  const t = useTranslations();
  const tagUI = tv({
    base: "text-xs! select-none! font-estedad!",
  });
  switch (mode) {
    case 0:
      return (
        <Tag className={tagUI()} color={"blue"}>
          {t("common.orderMode.0")}
        </Tag>
      );

    case 1:
      return (
        <Tag className={tagUI()} color={"blue"}>
          {t("common.orderMode.1")}
        </Tag>
      );

    case 2:
      return (
        <Tag className={tagUI()} color={"blue"}>
          {t("common.orderMode.2")}
        </Tag>
      );

    default:
      <Tag className={tagUI()}>{t("common.orderMode.3")} </Tag>;
  }
};

export default OrderModeTag;
