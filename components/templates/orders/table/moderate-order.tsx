"use client";
import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Order } from "@/core/types/types";
import { Dropdown, MenuProps } from "antd";
import { Ellipsis } from "lucide-react";
import React, { useEffect } from "react";
import EditOrderDrawer from "./edit-order-drawer";
import { useTranslations } from "next-intl";
const ModerateOrder = ({
  onSuccess,
  order,
}: {
  order: Order;
  onSuccess: () => {};
}) => {
  const [isOpen, toggle] = useToggle();
  const t = useTranslations("orders");

  const moderateOptions: MenuProps["items"] = [
    {
      key: "0",
      label: t("editOrder"),
      onClick: () => toggle(),
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
