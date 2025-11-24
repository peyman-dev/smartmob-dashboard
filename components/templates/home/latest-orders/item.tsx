import { Tag } from "antd"
import { CalendarDays } from "lucide-react"

const Item = () => {
  return (
    <article className="h-14 items-center grid text-sm! grid-cols-4 *:h-full *:flex *:items-center **:flex **:items-center **:gap-1! min-w-[380px]">
      <div>
        <p className="text-sm text-gray-900">
          <strong>پیمان احمدی</strong>
        </p>
      </div>
      <div className="text-xs  select-none text-[#718096]">
        <CalendarDays className="size-3.5" />
        <span>۲ آذر ۱۴۰۴</span>
      </div>
      <div>
        <div className="">
          <strong>{Number(2_599).toLocaleString("fa-ir")} سکه</strong>
        </div>
      </div>
      <div>
        <Tag className="font-estedad! text-xs! select-none! cursor-pointer!" color="green">
          تکمیل شده
        </Tag>
      </div>
    </article>
  )
}

export default Item
