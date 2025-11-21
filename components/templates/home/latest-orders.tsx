import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const LatestOrders = () => {
  return (
    <div className="p-4 border rounded-2xl border-zinc-200">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">آخرین سفارشات</h4>
        <Link
          className="flex items-center gap-1 text-zinc-600 text-xs"
          href={"/orders"}
        >
          <span>مشاهده کامل</span>
          <ChevronLeft className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default LatestOrders;
