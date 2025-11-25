"use client";
import DynamicDrawer from "@/components/common/drawer";
import { moderateUserStatus } from "@/core/actions";
import useToggle from "@/core/hooks/use-toggle";
import { User } from "@/core/types/types";
import { Dropdown, MenuProps, Modal } from "antd";
import { Ban, Ellipsis, Lock, UserCheck, UserPen } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { tv } from "tailwind-variants";
import EditUserInfos from "./fragments/edit-user-infos";

const ModerateUser = ({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) => {
  const [isOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, toggleDropdown] = useToggle();
  const [isDrawerOpen, toggleDrawer] = useToggle();

  const buttonUi = tv({
    base: "text-sm! cursor-pointer",
    variants: {
      type: {
        ban: "text-red-500!",
        unban: "text-blue-500",
      },
    },
  });

  const isUserBanned = user.accountInfo.status;

  const handleOk = () => {
    startTransition(async () => {
      const response = await moderateUserStatus({
        status: isUserBanned ? 0 : 1,
        user: user._id,
      });

      if (response.status) {
        toast.success("وضعیت کاربر با موفقیت تغییر کرد");
      } else {
        toast.error("خطایی رخ داده است.");
      }

      toggle();
      onSuccess();
    });
  };

  const menuItems: MenuProps["items"] = [
    {
      label: "مدیریت دسترسی کاربر",
      extra: <Lock className="size-4.5" />,
      key: 1,
      onClick: toggle,
      className: "h-10 text-sm!",
    },
    {
      label: "تغییر اطلاعات",
      key: 2,
      onClick: toggleDrawer,
      className: "h-10 text-sm!",
      extra: <UserPen className="size-4.5" />,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        // className="**:font-estedad!"
        rootClassName="font-estedad!"
        trigger={["click"]}
        open={isDropdownOpen}
        onOpenChange={toggleDropdown}
      >
        <button className="cursor-pointer!">
          <Ellipsis />
        </button>
      </Dropdown>
      <EditUserInfos onSuccess={onSuccess} isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}  user={user}/>

      <Modal
        open={isOpen}
        okButtonProps={{
          variant: "solid",
          color: isUserBanned ? "blue" : "red",
          loading: isPending,
        }}
        title={isUserBanned ? "آزادسازی کاربر" : "محدودسازی کاربر"}
        className="**:font-estedad!"
        okText="تائید"
        onCancel={toggle}
        cancelText="انصراف"
        onOk={handleOk}
        // centered
      >
        <div className="py-10 text-center">
          <p>
            آیا از {isUserBanned ? "آزادسازی این" : "محدود کردن"} کاربر
            <span className="underline font-bold max-w-max mx-1">
              {" "}
              {user.accountInfo.name}{" "}
            </span>
            اطمینان دارید؟
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ModerateUser;
