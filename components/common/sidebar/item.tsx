"use client";

import { useSidebarStore } from "@/core/stores/sidebar.store";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface IProps {
  label: string;
  Icon: ReactNode;
  href: string;
}

const Item = ({ Icon, href, label }: IProps) => {
  const pathname = usePathname();
  const { toggleMenu } = useSidebarStore();

  const isActive = pathname === href;

  return (
    <Link
    onClick={toggleMenu}
      href={href}
      className={clsx(
        "flex items-center gap-2.5 h-[47px] px-4 rounded-xl transition-all duration-200",
        {
          "bg-[#194BFB] text-white": isActive,
          "text-[#718096] hover:bg-gray-100": !isActive,
        }
      )}
    >
      <span className={clsx({ "text-white": isActive })}>{Icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Item;
