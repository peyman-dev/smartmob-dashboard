"use client";

import DynamicDrawer from "@/components/common/drawer";
import { updateOrder } from "@/core/actions";
import { statuses } from "@/core/lib/helpers";
import { Order } from "@/core/types/types";
import { Button, Input, InputNumber, InputNumberProps, Select } from "antd";
import React, { memo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl"; // اضافه شد

const EditOrderDrawer = ({
  isOpen,
  toggle,
  order,
  onSuccess,
}: {
  order: Order;
  toggle: () => void;
  isOpen: boolean;
  onSuccess: () => void;
}) => {
  const t = useTranslations("users.editOrder"); // مسیر ترجمه

  const [values, setValues] = useState<Order>(order);
  const [status, setStatus] = useState<{ statusCode?: number; statusText?: string }>({});
  const [isPending, startTransition] = useTransition();

  // فرمت عدد با کاما
  const formatter: InputNumberProps<number>["formatter"] = (value) => {
    if (!value) return "";
    const [start, end] = `${value}`.split(".");
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return end ? `${v}.${end}` : v;
  };

  const options = statuses.map((stat) => ({
    label: stat.label,
    value: stat.value,
    disabled: stat.index === order?.status?.code,
  }));

  const handleOk = () => {
    startTransition(async () => {
      const res = await updateOrder({
        order: order._id,
        statusCode: Number(status?.statusCode) || order.status.code,
        quantity: values.quantity,
        quantityComp: values.quantityComp,
        startNumber: values.startNumber,
        target: values.target,
        targetId: values.targetId,
      });

      if (res.status) {
        toast.success(t("successToast"));
        toggle();
        onSuccess();
      } else {
        toast.error(t("errorToast"));
      }
    });
  };

  const DrawerFooter = (
    <div className="flex items-center justify-end gap-3">
      <Button onClick={toggle} variant="filled" color="red">
        {t("cancelButton")}
      </Button>
      <Button onClick={handleOk} color="blue" variant="solid" loading={isPending}>
        {t("saveButton")}
      </Button>
    </div>
  );

  return (
    <DynamicDrawer
      open={isOpen}
      toggle={toggle}
      title={t("title")}
      className="p-5 *:w-full! **:block *:space-y-5!"
      footer={DrawerFooter}
    >
      {/* تعداد سفارش */}
      <div className="space-y-2">
        <label>{t("quantityLabel")}</label>
        <InputNumber
          className="w-full mt-1 h-10"
          value={values.quantity || 0}
          formatter={formatter}
          onChange={(v) => setValues((prev) => ({ ...prev, quantity: Number(v) || 0 }))}
        />
      </div>

      {/* مقدار تکمیل شده */}
      <div className="space-y-2">
        <label>{t("quantityCompLabel")}</label>
        <InputNumber
          className="w-full mt-1 h-10"
          value={values.quantityComp || 0}
          formatter={formatter}
          onChange={(v) => setValues((prev) => ({ ...prev, quantityComp: Number(v) || 0 }))}
        />
      </div>

      {/* نام کاربری هدف */}
      <div className="space-y-2">
        <label>{t("targetLabel")}</label>
        <Input
          className="w-full mt-1 h-10"
          dir="ltr"
          value={values.target || ""}
          placeholder={t("targetPlaceholder")}
          onChange={(e) => setValues((prev) => ({ ...prev, target: e.target.value }))}
        />
      </div>

      {/* شناسه هدف */}
      <div className="space-y-2">
        <label>{t("targetIdLabel")}</label>
        <Input
          className="w-full mt-1 h-10"
          dir="ltr"
          value={values.targetId || ""}
          placeholder={t("targetIdPlaceholder")}
          onChange={(e) => setValues((prev) => ({ ...prev, targetId: e.target.value }))}
        />
      </div>

      {/* شروع از تعداد */}
      <div className="space-y-2">
        <label>{t("startNumberLabel")}</label>
        <InputNumber
          className="w-full mt-1 h-10"
          dir="ltr"
          value={values.startNumber || 0}
          formatter={formatter}
          onChange={(v) => setValues((prev) => ({ ...prev, startNumber: Number(v) || 0 }))}
        />
      </div>

      {/* وضعیت سفارش */}
      <div className="space-y-2">
        <label>{t("statusLabel")}</label>
        <Select
          className="w-full mt-1"
          placeholder={t("statusPlaceholder")}
          options={options}
          defaultValue={statuses.find((s) => order?.status.code === s.index)?.value}
          onChange={(v) => {
            const target = statuses.find((stat) => stat.value === v);
            setStatus({
              statusCode: target?.index,
              statusText: target?.value.toLowerCase(),
            });
          }}
        />
      </div>
    </DynamicDrawer>
  );
};

export default memo(EditOrderDrawer);