"use client";

import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Button, DatePicker, Input, Select } from "antd";
import { Search } from "lucide-react";
import React, { useTransition } from "react";
import { useSearchStore } from "./search.store";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import useUserFinder from "@/core/hooks/use-user-finder";

type SearchFormValues = {
  status?: 0 | 1 | 2 | 3 | 4;
  user?: string;
  serviceId?: string;
  target?: string;
  targetId?: string;
  dateStart?: number;
  dateEnd?: number;
};

const OrderFilters = () => {
  const tCommon = useTranslations("common");
  const t = useTranslations("orderFilters");
  const { setIsSearchingUser } = useUserFinder();

  const [values, setValues] = React.useState<SearchFormValues>({});
  const [isDrawerOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();

  const { search, isSearching, clearSearch } = useSearchStore();

  const handleSearch = () => {
    setIsSearchingUser(false)
    startTransition(async () => {
      await search({
        page: 0,
        limit: 20,
        status: values.status,
        user: values.user?.trim() || undefined,
        serviceId: values.serviceId?.trim() || undefined,
        target: values.target?.trim() || undefined,
        targetId: values.targetId?.trim() || undefined,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
      });
      toggle();
    });
  };

  const handleClear = () => {
    toggle();
    setValues({});
    clearSearch();
  };

  return (
    <>
      <div className="*:cursor-pointer *:flex *:items-center *:gap-1 *:h-10 *:rounded-lg *:bg-white *:justify-center *:hover:shadow-sm text-xs *:px-3 *:border *:border-zinc-200">
        <Button
          onClick={() => toggle()}
          className="h-10!"
          iconPosition="end"
          icon={<Search className="size-4.5" />}
        >
          <span>{tCommon("professionalSearch")}</span>
        </Button>
      </div>

      <DynamicDrawer
        open={isDrawerOpen}
        toggle={toggle}
        title={tCommon("doSearch")}
      >
        <div className="space-y-5">
          {/* وضعیت سفارش */}
          <div className="space-y-2">
            <label>{t("orderStatus")}</label>
            <Select
              allowClear
              placeholder={t("allStatuses")}
              className="w-full h-10"
              value={values.status}
              onChange={(v) => setValues((p) => ({ ...p, status: v }))}
              options={[
                { label: t("status_0"), value: 0 },
                { label: t("status_1"), value: 1 },
                { label: t("status_2"), value: 2 },
                { label: t("status_3"), value: 3 },
                { label: t("status_4"), value: 4 },
              ]}
            />
          </div>

          {/* شناسه کاربر */}
          <div className="space-y-2">
            <label>{t("userId")}</label>
            <Input
              dir="ltr"
              placeholder={t("userId_placeholder")}
              value={values.user ?? ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, user: e.target.value }))
              }
            />
          </div>

          {/* سرویس */}
          <div className="space-y-2">
            <label>{t("service")}</label>
            <Input
              dir="ltr"
              placeholder={t("service_placeholder")}
              value={values.serviceId ?? ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, serviceId: e.target.value }))
              }
            />
          </div>

          {/* هدف */}
          <div className="space-y-2">
            <label>{t("target")}</label>
            <Input
              dir="ltr"
              placeholder={t("target_placeholder")}
              value={values.target ?? ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, target: e.target.value }))
              }
            />
          </div>

          {/* شناسه هدف */}
          <div className="space-y-2">
            <label>{t("targetId")}</label>
            <Input
              dir="ltr"
              placeholder={t("targetId_placeholder")}
              value={values.targetId ?? ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, targetId: e.target.value }))
              }
            />
          </div>

          {/* تاریخ شروع */}
          <div className="space-y-2">
            <label>{t("dateStart")}</label>
            <DatePicker
              showTime
              dir="ltr"
              className="w-full h-10"
              placeholder={t("dateStart_placeholder")}
              value={values.dateStart ? dayjs(values.dateStart) : null}
              onChange={(date) =>
                setValues((p) => ({
                  ...p,
                  dateStart: date ? date.valueOf() : undefined,
                }))
              }
            />
          </div>

          {/* تاریخ پایان */}
          <div className="space-y-2">
            <label>{t("dateEnd")}</label>
            <DatePicker
              showTime
              dir="ltr"
              className="w-full h-10"
              placeholder={t("dateEnd_placeholder")}
              value={values.dateEnd ? dayjs(values.dateEnd) : null}
              onChange={(date) =>
                setValues((p) => ({
                  ...p,
                  dateEnd: date ? date.valueOf() : undefined,
                }))
              }
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4">
            <Button
              type="primary"
              size="large"
              className="flex-1"
              loading={isPending || isSearching}
              onClick={handleSearch}
            >
              {tCommon("search")}
            </Button>

            <Button size="large" className="flex-1" onClick={handleClear}>
              {tCommon("clear")}
            </Button>
          </div>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default OrderFilters;
