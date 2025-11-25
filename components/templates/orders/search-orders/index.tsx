"use client";
import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Button, DatePicker, Input, Select } from "antd";
import { Search } from "lucide-react";
import React, { useTransition } from "react";
import { useSearchStore } from "./search.store";
import dayjs from "dayjs";

type SearchFormValues = {
  status?: 0 | 1 | 2 | 3 | 4;
  user?: string;
  serviceId?: string;
  target?: string;
  targetId?: string;
  dateStart?: number; // timestamp in ms
  dateEnd?: number;   // timestamp in ms
};

const SearchOrders = () => {
  const [values, setValues] = React.useState<SearchFormValues>({});
  const [isDrawerOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();

  const { search, isSearching, clearSearch } = useSearchStore();

  const handleSearch = () => {
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

      toggle(); // اختیاری: بعد از جستجو دراور بسته بشه
    });
  };

  const handleClear = () => {
      toggle(); // اختیاری: بعد از جستجو دراور بسته بشه
      setValues({});
    clearSearch();
  };

  return (
    <>
      <div className="*:cursor-pointer *:flex *:items-center *:gap-1 *:h-10 *:rounded-lg *:bg-white *:justify-center *:hover:shadow-sm text-xs *:px-3 *:border *:border-zinc-200">
        <Button
          onClick={toggle}
          className="h-10!"
          iconPosition="end"
          icon={<Search className="size-4.5" />}
        >
          <span>جستجو پیشرفته</span>
        </Button>
      </div>

      <DynamicDrawer open={isDrawerOpen} toggle={toggle} title="جستجو کنید">
        <div className="space-y-5">
          {/* وضعیت سفارش */}
          <div className="space-y-2">
            <label>وضعیت سفارش</label>
            <Select
              allowClear
              placeholder="همه وضعیت‌ها"
              className="w-full h-10"
              value={values.status}
              onChange={(v) => setValues((p) => ({ ...p, status: v }))}
              options={[
                { label: "در حال پردازش", value: 0 },
                { label: "تکمیل شده", value: 1 },
                { label: "در حال انجام", value: 2 },
                { label: "انصراف داده شده", value: 3 },
                { label: "جزئی", value: 4 },
              ]}
            />
          </div>

          {/* شناسه کاربر */}
          <div className="space-y-2">
            <label>شناسه کاربر</label>
            <Input
              dir="ltr"
              placeholder="مثال: 974d0b40006..."
              value={values.user ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, user: e.target.value }))}
            />
          </div>

          {/* سرویس */}
          <div className="space-y-2">
            <label>سرویس</label>
            <Input
              dir="ltr"
              placeholder="شناسه یا نام سرویس"
              value={values.serviceId ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, serviceId: e.target.value }))}
            />
          </div>

          {/* هدف */}
          <div className="space-y-2">
            <label>هدف (target)</label>
            <Input
              dir="ltr"
              placeholder="مثال: post, profile"
              value={values.target ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, target: e.target.value }))}
            />
          </div>

          {/* شناسه هدف */}
          <div className="space-y-2">
            <label>شناسه هدف (targetId)</label>
            <Input
              dir="ltr"
              placeholder="شناسه عددی یا رشته‌ای هدف"
              value={values.targetId ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, targetId: e.target.value }))}
            />
          </div>

          {/* از تاریخ */}
          <div className="space-y-2">
            <label>از تاریخ</label>
            <DatePicker
              className="w-full h-10"
              placeholder="انتخاب تاریخ"
              value={values.dateStart ? dayjs(values.dateStart) : null}
              onChange={(date) =>
                setValues((p) => ({
                  ...p,
                  dateStart: date ? date.startOf("day").valueOf() : undefined,
                }))
              }
            />
          </div>

          {/* تا تاریخ */}
          <div className="space-y-2">
            <label>تا تاریخ</label>
            <DatePicker
              className="w-full h-10"
              placeholder="انتخاب تاریخ"
              value={values.dateEnd ? dayjs(values.dateEnd) : null}
              onChange={(date) =>
                setValues((p) => ({
                  ...p,
                  dateEnd: date ? date.endOf("day").valueOf() : undefined,
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
              جستجو
            </Button>
            <Button size="large" className="flex-1" onClick={handleClear}>
              پاک کردن
            </Button>
          </div>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default SearchOrders;