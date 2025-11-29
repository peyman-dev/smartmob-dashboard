/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DynamicAuthHeader from "../../templates/auth/common/dynamic-auth-header";
import AuthInput from "./auth-input";
import LoginFormActions from "./actions";
import LoginButton from "./login-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/core/validations/auth-validation";
import WithError from "./with-error";
import { login } from "@/core/actions";
import { toast } from "sonner";
import { useSessionStore } from "@/core/stores/auth.store";
import { redirect } from "next/navigation";
import { User } from "@/core/types/types";
import { useTwoAuthentication } from "@/core/stores/two.authentication.store";
import { useTransition } from "react";

const LoginForm = () => {
  const { setIsOTPSent, setPassword, setUsername } = useTwoAuthentication();
  const { updateSession } = useSessionStore();
  const [isPending, startAsyncAction] = useTransition();
  const {
    getValues,
    register,
    reset,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const submitted = async (values: any) => {
    // toast.promise(
    startAsyncAction(
      async () =>
        await login({
          password: values.password,
          username: values.username,
        }).then(async (r) => {
          if (r.code == 1) {
            toast.error("اطلاعات نامعتبر", {
              position: "top-right",
              description: "نام کاربری یا گذرواژه شما اشتباه است."
            });
          } else if (r.code == 4) {
            toast.error("لطفا منتظر بمانید", {
              position: "top-right",
              description: "رمز یکبار مصرف برای شما ارسال شده است"
            });
            setIsOTPSent(true)
          } else {
            if (r.code == 201) {
              // await handleCookies(r.data as User);
              setUsername(values.username);
              setPassword(values.password);
              setIsOTPSent(true);
              toast.success("کد عبور با موفقیت ارسال گردید", {
                position: "top-right",
              });
              // await updateSession();
            }
          }
        })
    );

    // {
    //   closeButton: true,
    //   loading: "درحال ورود به حساب کاربری ...",
    //   className: "font-estedad!",
    //   success: "شما با موفقیت وارد شدید !",
    //   duration: 2500,
    //   error: (r) => {
    //     return r.message;
    //   },
    //   description(data) {
    //     if (data.code == 200) {
    //       return "درحال انتقال, لطفا صبور باشید ..";
    //     }
    //   },
    //   onAutoClose(toast) {
    //     redirect("/");
    //   },
    // }
    // );
  };

  return (
    <form
      className="space-y-4 container md:w-[60%]!  w-full *:w-full! h-dvh flex items-center justify-center! *:max-h-max! flex-col"
      action={"#"}
      onSubmit={handleSubmit(submitted)}
    >
      <DynamicAuthHeader />
      <WithError error={errors.username?.message}>
        <AuthInput
          placeholder="نام کاربری یا شماره موبایل"
          dir="ltr"
          onChange={(e) => {
            setValue("username", e.target.value);
          }}
          className="placeholder:text-end!"
        />
      </WithError>
      <WithError error={errors.password?.message}>
        <AuthInput
          type="password"
          placeholder="لطفا گذرواژه خود را وارد نمائید"
          dir="ltr"
          className="placeholder:text-end!"
          onChange={(e) => {
            setValue("password", e.target.value);
          }}
        />
      </WithError>
      <LoginFormActions />
      <LoginButton loading={isPending} />
    </form>
  );
};

export default LoginForm;
