"use client";
import DynamicDrawer from "@/components/common/drawer";
import { updateOrder } from "@/core/actions";
import { findActiveStatus, statuses } from "@/core/lib/helpers";
import { Order } from "@/core/types/types";
import {
  Button,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  SelectProps,
} from "antd";
import React, { memo, useState, useTransition } from "react";
import { toast } from "sonner";

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
  const [values, setValues] = useState<Order>(order);
  const [status, setStatus] = useState<{statusCode?: number, statusText?: string}>({});
  const formatter: InputNumberProps<number>["formatter"] = (value) => {
    const [start, end] = `${value}`.split(".") || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${end ? `${v}.${end}` : `${v}`}`;
  };

  const options: SelectProps["options"] = statuses.map((stat) => ({
    label: stat.label,
    value: stat.value,
    disabled: stat.index === order?.status?.code,
  }));
  const [isPending, startTransition] = useTransition();

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
        toast.success("سفارش با موفقیت بروزرسانی شد");
        toggle();
        onSuccess();
      } else {
        toast.error("ویرایش سفارش ناموفق بود.");
      }
    });
  };

  const DrawerFooter = (
    <div className="flex! items-center! justify-end! space-y-0! gap-3!">
      <Button variant="filled" color="red">
        انصراف
      </Button>
      <Button onClick={handleOk} color="blue" variant="solid">
        ذخیره تغییرات
      </Button>
    </div>
  );

  return (
    <DynamicDrawer
      open={isOpen}
      toggle={toggle}
      title="ویرایش سفارش"
      className="p-5 *:w-full! **:block *:space-y-5!"
      footer={DrawerFooter}
    >
      <div className="space-y-2!">
        <label htmlFor="">تعداد سفارش</label>
        <InputNumber
          className="w-full! mt-1! h-10 "
          value={values.quantity || 0}
          formatter={formatter}
          onChange={(v) => {
            setValues((rest) => ({
              ...rest,
              quantity: Number(v),
            }));
          }}
        />
      </div>

      <div className="space-y-2!">
        <label htmlFor="">مقدار تکمیل شده</label>
        <InputNumber
          value={values.quantityComp || 0}
          className="w-full! mt-1! h-10 "
          formatter={formatter}
          onChange={(v) => {
            setValues((rest) => ({
              ...rest,
              quantityComp: Number(v),
            }));
          }}
        />
      </div>

      <div className="space-y-2!">
        <label htmlFor="">نام کاربری هدف</label>
        <Input
          className="w-full! mt-1! h-10 "
          dir="ltr"
          value={values.target || ""}
          placeholder="@instagram"
          onChange={(e) => {
            setValues((rest) => ({
              ...rest,
              target: String(e.target.value),
            }));
          }}
        />
      </div>

      <div className="space-y-2!">
        <label htmlFor="">شناسه هدف</label>
        <Input
          className="w-full! mt-1! h-10 "
          dir="ltr"
          value={values.targetId || ""}
          placeholder="example: instagram-id948305857"
          onChange={(e) => {
            setValues((rest) => ({
              ...rest,
              targetId: String(e.target.value),
            }));
          }}
        />
      </div>

      <div className="space-y-2!">
        <label htmlFor="">شروع از تعداد</label>
        <InputNumber
          className="w-full! px-5! pt-1! mt-1! h-10 "
          dir="ltr"
          formatter={formatter}
          value={values.startNumber || 0}
          onChange={(v) => {
            setValues((rest) => ({
              ...rest,
              startNumber: Number(v),
            }));
          }}
        />
      </div>

      <div className="space-y-2!">
        <label htmlFor="">وضعیت سفارش</label>
        <Select
          className="w-full! mt-1!  "
          placeholder="انتخاب کنید ..."
          options={options}
          defaultValue={statuses.find(stat => (order?.status.code == stat.index))?.value}
          onChange={(v) => {
            const target = statuses.find((stat) => stat.value == v);
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
