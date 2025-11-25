import OrderModeTag from "@/components/ui/order-mode-tag"
import { Order } from "@/core/types/types"
import { Tag } from "antd"
import { CalendarDays } from "lucide-react"
import Image from "next/image"

const Item = ({order}: {order: Order}) => {
  return (
    <article className="h-14 items-center grid text-sm! grid-cols-4 *:h-full *:flex *:items-center **:flex **:items-center **:gap-1! min-w-[380px]">
      <div>
        <Image width={32} height={32} className="rounded-full max-h-8" alt={order.img} src={order.img} />
        <p className="text-sm text-gray-900">
          {order.target}
        </p>
      </div>
      <div>
        <OrderModeTag 
          mode={order.mode}
        />
      </div>
      <div>
        <div className="">
          <strong>{Number(order.quantity).toLocaleString("fa-ir")} عدد</strong>
        </div>
      </div>
      <div>
        <Tag className="font-estedad! text-xs! select-none! cursor-pointer!" color={order.status.color}>
          {order.status.textPer}
        </Tag>
      </div>
    </article>
  )
}

export default Item
