"use client";
import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Order } from "@/core/types/types";
import { Dropdown, MenuProps } from "antd";
import { Edit, Ellipsis, User } from "lucide-react";
import React, { useEffect } from "react";
import EditOrderDrawer from "./edit-order-drawer";
import { useTranslations } from "next-intl";
import useUserFinder from "@/core/hooks/use-user-finder";
const ModerateOrder = ({
  onSuccess,
  order,
}: {
  order: Order;
  onSuccess: () => {};
}) => {
  const [isOpen, toggle] = useToggle();
  const t = useTranslations("orders");
  const ct = useTranslations("common");
  const {navigateToWithUser} = useUserFinder()

  const moderateOptions: MenuProps["items"] = [
    {
      key: "0",
      label: t("editOrder"),
      onClick: () => toggle(),
      extra: <Edit className="size-4"/>
    },
    {
      key: "1",
      label: ct("searchUser"),
      onClick: () => navigateToWithUser("/users", order.user),
      extra: <User className="size-4.5"/>
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: moderateOptions }}>
        <button>
          <Ellipsis />
        </button>
      </Dropdown>

      <EditOrderDrawer
        onSuccess={onSuccess}
        isOpen={isOpen}
        order={order}
        toggle={toggle}
      />
    </>
  );
};

export default ModerateOrder;
