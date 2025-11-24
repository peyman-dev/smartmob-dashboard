"use client";
import { moderateUserStatus } from "@/core/actions";
import useToggle from "@/core/hooks/use-toggle";
import { User } from "@/core/types/types";
import { Modal } from "antd";
import { Ban, UserCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { tv } from "tailwind-variants";

const ModerateUser = ({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) => {
  const [isOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();

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
      onSuccess()
    });
  };

  return (
    <div>
      <button
        className={buttonUi({
          type: isUserBanned ? "unban" : "ban",
        })}
        onClick={toggle}
      >
        {isUserBanned ? (
          <>
            <p>حذف محدودیت</p>
            <UserCheck className="size-4!" />
          </>
        ) : (
          <>
            <p>محدودسازی</p>
            <Ban className="size-4!" />
          </>
        )}
      </button>
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
    </div>
  );
};

export default ModerateUser;
