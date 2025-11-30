"use client";
import DynamicDrawer from "@/components/common/drawer";
import { filterTransfers } from "@/core/actions";
import { Button, Input } from "antd";
import { useTranslations } from "next-intl";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

interface IProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess: () => void;
  setFilters: any;
}

const Drawer = ({ isOpen, toggle, onSuccess, setFilters }: IProps) => {
  const t = useTranslations("transfers");
  const cT = useTranslations("common");
  const [loading, startTransition] = useTransition();

  const [values, setValues] = useState({
    sender: "",
    receiver: "",
  });

  const handleSubmit = () => {
    try {
      startTransition(async () => {
        const res = await filterTransfers({
          receiver: values.receiver,
          sender: values.sender,
        });

        if (res.ok) {
          setFilters({
            isFiltered: true,
            filteredItems: res.data,
          });
          onSuccess()
        }
      });
    } catch (error) {
      toast.error("update_failed");
    }
  };

  const Footer = (
    <div className="flex items-center gap-3 justify-end">
      <Button color="red" onClick={toggle} variant="outlined">
        {cT("cancel")}
      </Button>
      <Button
        loading={loading}
        onClick={handleSubmit}
        color="blue"
        variant="solid"
      >
        {cT("confirm")}
      </Button>
    </div>
  );
  return (
    <DynamicDrawer
      title={t("filterTransfers")}
      open={isOpen}
      footer={Footer}
      onClose={toggle}
    >
      <div className="space-y-4">
        <div>
          <label>{t("sender")}</label>
          <Input
            onChange={(e) => {
              setValues((prev) => ({ ...prev, sender: e.target.value }));
            }}
            className="grow mt-2! h-10!"
          />
        </div>

        <div>
          <label>{t("receiver")}</label>
          <Input
            className="grow mt-2! h-10!"
            onChange={(e) => {
              setValues((prev) => ({ ...prev, receiver: e.target.value }));
            }}
          />
        </div>
      </div>
    </DynamicDrawer>
  );
};

export default Drawer;
