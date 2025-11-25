"use client"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Item from "./item"
import { Order } from "@/core/types/types"

const LatestOrders = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="p-4 border rounded-2xl border-zinc-200">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">آخرین سفارشات</h4>
        <Link
          className="flex items-center gap-1 bg-[#FAFAFA] px-3 py-2 rounded-md text-zinc-600 text-xs"
          href={"/orders"}
        >
          <span>مشاهده کامل</span>
          <ChevronLeft className="size-4" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-zinc-200 overflow-x-auto">
        {Array.from(orders)
          .slice(0, 5)
          .map((item, i) => (
            <Item order={item} key={i} />
          ))}
      </div>
    </div>
  )
}

export default LatestOrders
