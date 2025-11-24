import clsx from "clsx";
import React from "react";

const Currency = ({
  currency,
  className,
}: {
  currency: "TOMAN" | "USD";
  className?: string;
}) => {
  return (
    <span className={clsx("inline-block text-sm", className)}>
      {currency == "TOMAN" ? "تومان" : "دلار"}
    </span>
  );
};

export default Currency;
