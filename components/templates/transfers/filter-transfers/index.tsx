"use client";
import useToggle from "@/core/hooks/use-toggle";
import { Button } from "antd";
import { FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import Drawer from "./drawer";

const FilterTransfers = ({
  setFilters,
}: {
  setFilters: React.ActionDispatch<any>;
}) => {
  const [isOpen, toggle] = useToggle();
  const t = useTranslations("common");
  return (
    <>
      <Button icon={<FilterIcon className="size-4" />} onClick={() => toggle()}>
        {t("filter")}
      </Button>

      <Drawer isOpen={isOpen} onSuccess={() => toggle()} toggle={toggle}  setFilters={setFilters}/>
    </>
  );
};

export default FilterTransfers;
