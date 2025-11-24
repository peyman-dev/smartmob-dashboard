"use client";
import React from "react";
import { Column } from "@ant-design/plots";

const DetailsChart = ({
  accounts,
  users,
  transactions,
}: {
  accounts: number;
  users: number;
  transactions: number;
}) => {
  // داده‌ها بر اساس تصویر تخمین زده شدن (تقریباً همان نسبت‌ها)
  const data = [
    { label: "حساب ها", value: accounts },
    { label: "کاربران", value: users },
    { label: "تراکنش ها", value: transactions },
  ];

  const config = {
    data,
    xField: "label",
    yField: "value",
    columnStyle: {
      radius: [8, 8, 0, 0], // گوشه‌های بالا گرد بشن (مثل تصویر)
    },
    color: "#4e8aff", // رنگ آبی دقیقاً مثل تصویر
    legend: false, // لجند لازم نداریم
    label: false, // برچسب مقدار روی ستون‌ها نمی‌خواهیم

    xAxis: {
      label: {
        style: {
          fill: "#8c8c8c",
          fontSize: 13,
        },
      },
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: {
        style: {
          fill: "#8c8c8c",
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
            lineDash: [4, 4],
          },
        },
      },
    },
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1000,
      },
    },
    // فاصله بین ستون‌ها و حاشیه‌ها
    columnWidthRatio: 0.5,
    meta: {
      value: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full!" style={{ padding: "20px", background: "#fff", borderRadius: "12px" }}>
      <Column {...config} className={"**:font-estedad!"} />
    </div>
  );
};

export default DetailsChart;
