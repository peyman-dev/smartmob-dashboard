"use client";
import DynamicDrawer from "@/components/common/drawer";
import { moderateUserStatus } from "@/core/actions";
import useToggle from "@/core/hooks/use-toggle";
import { User } from "@/core/types/types";
import { Dropdown, MenuProps, Modal } from "antd";
import { Ban, Ellipsis, Lock, ShoppingBag, TrendingUpDown, UserCheck, UserPen, Users } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { tv } from "tailwind-variants";
import EditUserInfos from "./fragments/edit-user-infos";
import { useTranslations } from "next-intl";
import useUserFinder from "@/core/hooks/use-user-finder";

const ModerateUser = ({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) => {
  const {navigateToWithUser} = useUserFinder()
  const t = useTranslations("users")
  const gt = useTranslations()
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
        toast.success(t("user_status_changed"));
      } else {
        toast.error("خطایی رخ داده است.");
      }

      toggle();
      onSuccess();
    });
  };

  const menuItems: MenuProps["items"] = [
    {
      label: t("userAccessManagement"),
      extra: <Lock className="size-4.5" />,
      key: 1,
      onClick: () => toggle(),
      className: "h-10 text-sm!",
    },
    {
      label: t("editInformation"),
      key: 2,
      onClick: () => toggleDrawer(),
      className: "h-10 text-sm!",
      extra: <UserPen className="size-4.5" />,
    },
    {
      label: t("accounts_of_user"),
      key: 3,
      onClick: () => navigateToWithUser("/accounts", user._id),
      className: "h-10 text-sm!",
      extra: <Users className="size-4.5" />,
    },
    {
      label: t("user_transfers"),
      key: 4,
      onClick: () => navigateToWithUser("/transfers", user._id),
      className: "h-10 text-sm!",
      extra: <TrendingUpDown className="size-4.5" />,
    },
    {
      label: t("user_orders"),
      key: 5,
      onClick: () => navigateToWithUser("/orders", user._id),
      className: "h-10 text-sm!",
      extra: <ShoppingBag className="size-4.5" />,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        rootClassName="font-estedad!"
        trigger={["click"]}
        open={isDropdownOpen}
        onOpenChange={toggleDropdown}
      >
        <button className="cursor-pointer!">
          <Ellipsis />
        </button>
      </Dropdown>
      <EditUserInfos onSuccess={onSuccess} isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} user={user}/>

      <Modal
        open={isOpen}
        okButtonProps={{
          variant: "solid",
          color: isUserBanned ? "blue" : "red",
          loading: isPending,
        }}
        title={isUserBanned ? t("unblockUser") : t("blockUser")}
        className="**:font-estedad!"
        okText={gt("common.confirm")}
        onCancel={() => toggle()}
        cancelText={gt("common.cancel")}
        onOk={handleOk}
      >
        <div className="py-10 text-center">
          <p>
            {t("confirm_user_restriction", { 
              username: user.accountInfo.username, 
              action: isUserBanned ? t("unblockUser") : t("blockUser")
            })}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ModerateUser;