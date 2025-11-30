import OrderModeTag from "@/components/ui/order-mode-tag";
import { useLocalization } from "@/core/stores/localization.store";
import { Order } from "@/core/types/types";
import { Tag } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Item = ({ order }: { order: Order }) => {
  const { locale } = useLocalization();
  const t = useTranslations();
  const isEN = locale == "en";
  return (
    <article
      className="
      grid grid-cols-4 items-center h-14 text-sm
      gap-3
      overflow-x-auto
      min-w-max
    "
    >
      {/* Cell 1 */}
      <div className="flex items-center gap-2 w-[120px] line-clamp-1">
        <Image
          width={32}
          height={32}
          className="rounded-full max-h-8 shrink-0"
          alt={order.img}
          src={order.img}
        />
        <p className="text-sm text-gray-900 line-clamp-1">{order.target}</p>
      </div>

      {/* Cell 2 */}
      <div className="flex items-center w-[120px]! line-clamp-1">
        <OrderModeTag mode={order.mode} />
      </div>

      {/* Cell 3 */}
      <div className="flex items-center min-w-[140px]">
        <strong className="line-clamp-1">
          {Number(order.quantity).toLocaleString()} {t("common.amount")}
        </strong>
      </div>

      {/* Cell 4 */}
      <div className="flex items-center w-[120px]! line-clamp-1">
        <Tag
          className="font-estedad text-xs select-none cursor-pointer"
          color={order.status.color}
        >
          {isEN ? order.status.text : order.status.textPer}
        </Tag>
      </div>
    </article>
  );
};

export default Item;
