"use client";

import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Button, Input, Select } from "antd";
import { Search } from "lucide-react";
import React, { useTransition } from "react";
import { useUserSearchStore } from "./settings/user.search.store";

type SearchFormValues = {
  status?: 0 | 1;
  deviceId?: string;
  account?: string;
};

const SearchUsers = () => {
  const [values, setValues] = React.useState<SearchFormValues>({});
  const [isDrawerOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();

  const { search,  clearSearch, setIsSearching } = useUserSearchStore();

  const handleSearch = () => {
    startTransition(async () => {
      await search({
        page: 0,
        limit: 20,
        status: values.status,
        deviceId: values.deviceId?.trim() || undefined,
        account: values.account?.trim() || undefined,
      });
      toggle(); // دراور رو می‌بنده بعد از جستجو (اختیاری)
    setIsSearching(true)
});
  };

  const handleClear = () => {
    setIsSearching(false)
    setValues({});
    clearSearch();
    toggle();
  };

  return (
    <>
      <div className="*:cursor-pointer *:flex *:items-center *:gap-1 *:h-10 *:rounded-lg *:bg-white *:justify-center *:hover:shadow-sm text-xs *:px-3 *:border *:border-zinc-200">
        <Button
          onClick={toggle}
          iconPosition="end"
          icon={<Search className="size-4.5" />}
        >
          <span>جستجوی کاربران</span>
        </Button>
      </div>

      <DynamicDrawer open={isDrawerOpen} toggle={toggle} title="جستجوی کاربران">
        <div className="space-y-5">
          {/* وضعیت کاربر */}
          <div className="space-y-2">
            <label>وضعیت کاربر</label>
            <Select
              allowClear
              placeholder="همه وضعیت‌ها"
              className="w-full h-10"
              value={values.status}
              onChange={(v) => setValues((p) => ({ ...p, status: v }))}
              options={[
                { label: "آزاد", value: 0 },
                { label: "مسدود شده", value: 1 },
              ]}
            />
          </div>

          {/* شناسه دستگاه */}
          <div className="space-y-2">
            <label>شناسه دستگاه (deviceId)</label>
            <Input
              dir="ltr"
              placeholder="مثال: abc123def456..."
              value={values.deviceId ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, deviceId: e.target.value }))}
            />
          </div>

          {/* نام کاربری اکانت */}
          <div className="space-y-2">
            <label>نام کاربری (account)</label>
            <Input
              dir="ltr"
              placeholder="مثال: @username یا username"
              value={values.account ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, account: e.target.value }))}
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4">
            <Button
              type="primary"
              size="large"
              className="flex-1"
              loading={isPending}
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

export default SearchUsers;