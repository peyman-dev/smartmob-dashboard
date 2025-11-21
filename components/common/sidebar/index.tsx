"use client";
import React from "react";
import Item from "./item";
import { Box, Home, Settings, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar-store";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu } = useSidebarStore();
  console.log(isMenuOpen);
  if (!isMobile) {
    return (
      <AnimatePresence>
        <motion.aside initial={{x: 400}} animate={{x:0}} className="min-w-[250px] sticky top-0 h-dvh space-y-3 p-6">
          <Item Icon={<Home />} href="/" label="خانه" />
          <Item Icon={<Box />} href="/orders" label="سفارشات" />
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
            className="w-full fixed space-y-3 p-6 bg-white shadow-xl h-dvh"
          >
            <div className="mb-10 flex items-center justify-end">
              <button onClick={toggleMenu}>
                <X />
              </button>
            </div>
            <Item Icon={<Home />} href="/" label="خانه" />
            <Item Icon={<Box />} href="/orders" label="سفارشات" />
            <Item Icon={<Users />} href="/users" label="کاربران" />
            <Item Icon={<Settings />} href="/settings" label="تنظیمات" />
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }
};

export default Sidebar;
