import React from "react";
import Item from "./item";
import { Box, Home, Settings, Users } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="min-w-[250px] space-y-3 p-6">
      <Item Icon={<Home />} href="/" label="خانه" />
      <Item Icon={<Box />} href="/orders" label="سفارشات" />
      <Item Icon={<Users />} href="/users" label="کاربران" />
      <Item Icon={<Settings />} href="/settings" label="تنظیمات" />
    </aside>
  );
};

export default Sidebar;
