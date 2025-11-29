"use client";
import UserRole from "@/components/templates/home/recent-users/user-card/elements/user-role";
import useToggle from "@/core/hooks/use-toggle";
import { DEFAULT_AVATAR } from "@/core/lib/constants";
import { useSessionStore } from "@/core/stores/auth.store";
import { User } from "@/core/types/types";
import { Dropdown, MenuProps } from "antd";
import { LogOut, Settings, UserPen } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const UserProfile = () => {
  const { session, status, clearSession } = useSessionStore();
  const [isOpen, toggle] = useToggle();
  const t = useTranslations("common.profileDropdown");
  const globalT = useTranslations("common");

  const menuItems: MenuProps["items"] = [
    {
      label: t("myAccount"),
      key: "'1",
      icon: <UserPen className="size-4 text-zinc-500" />,
      className: "font-estedad!",
      onClick() {},
    },
    {
      label: t("settings"),
      key: "2",
      icon: <Settings className="size-4 text-zinc-500" />,
      className: "font-estedad!",
      onClick() {},
    },
    {
      type: "divider",
    },
    {
      label: t("signOut"),
      key: "3",
      icon: <LogOut className="size-4" />,
      className: "font-estedad! text-red-500!",
      onClick: clearSession,
    },
  ];

  if (status == "authenticated") {
    return (
      <Dropdown
        onOpenChange={toggle}
        trigger={["click"]}
        className="max-w-max! text-sm!"
        menu={{ items: menuItems }}
      >
        <div
          className="flex lg:px-6 px-2 lg:ps-2 cursor-pointer hover:shadow select-none  py-1.5 rounded-lg border border-zinc-200 items-center gap-3"
          onClick={() => toggle()}
        >
          <Image width={42} height={42} alt="" src={DEFAULT_AVATAR} />
          <div className="space-y-2  lg:visible lg:block hidden invisible">
            <p className="text-xs lg:visible lg:block hidden invisible">
              {session?.name || t("dearUser")}
            </p>
            <UserRole
              className=" lg:visible lg:block hidden invisible"
              roles={session?.roles as User["roles"]}
            />
          </div>
        </div>
      </Dropdown>
    );
  } else {
    return (
      <p className="text-sm text-slate-500">{globalT("pleaseWait")}</p>
    );
  }
};

export default UserProfile;
