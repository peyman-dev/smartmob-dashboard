"use client";
import React from "react";
import Item from "./item";
import { HandCoins, Home, Settings, ShoppingBag, Users, UserSearch, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar.store";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu } = useSidebarStore();
  if (!isMobile) {
    return (
      <AnimatePresence>
        <motion.aside
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          className="min-w-[250px] sticky top-0 h-dvh space-y-3 p-4"
        >
          <Item Icon={<Home />} href="/" label="خانه" />
          <Item Icon={<ShoppingBag />} href="/orders" label="سفارشات" />
          <Item Icon={<HandCoins />} href="/transactions" label="انتقالات" />
          <Item Icon={<UserSearch />} href="/accounts" label="حساب‌ها" />
          <Item Icon={<Users />} href="/users" label="کاربران" />
          <Item Icon={<Settings />} href="/settings" label="تنظیمات" />
        </motion.aside>
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{
              x: 768,
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: 768,
            }}
            className="w-full fixed space-y-3 p-6 bg-white shadow-xl h-dvh! min-h-dvh z-50"
          >
            <div className="mb-10 flex items-center justify-end">
              <button onClick={toggleMenu}>
                <X />
              </button>
            </div>
            <Item Icon={<Home />} href="/" label="خانه" />
            <Item Icon={<ShoppingBag />} href="/transctions" label="سفارشات" />
            <Item Icon={<HandCoins />} href="/transactions" label="انتقالات" />
            <Item Icon={<Users />} href="/users" label="کاربران" />
            <Item Icon={<Settings />} href="/settings" label="تنظیمات" />
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }
};

export default Sidebar;
