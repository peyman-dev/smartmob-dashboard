"use client";
import { Tag } from "antd";
import React from "react";
import { tv } from "tailwind-variants";

const OrderModeTag = ({ mode }: { mode: number }) => {
  const tagUI = tv({
    base: "text-xs! select-none! font-estedad!",
  });
  switch (mode) {
    case 0:
      return (
        <Tag className={tagUI()} color={"blue"}>
          سفارش فالوور
        </Tag>
      );

    case 1:
      return (
        <Tag className={tagUI()} color={"blue"}>
          سفارش لایک
        </Tag>
      );

    case 2:
      return (
        <Tag className={tagUI()} color={"blue"}>
          سفارش کامنت
        </Tag>
      );

    default:
      <Tag className={tagUI()}>سفارش نامعتبر</Tag>;
  }
};

export default OrderModeTag;
