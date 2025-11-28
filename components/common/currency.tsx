"use client"
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React from "react";

const Currency = ({
  currency,
  className,
}: {
  currency: "TOMAN" | "USD";
  className?: string;
}) => {
  const t = useTranslations();
  return (
    <span className={clsx("inline-block text-sm", className)}>
      {t(`common.currency.${currency}`)}
    </span>
  );
};

export default Currency;
