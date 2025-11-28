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
import { useTwoAuthentication } from "@/core/stores/two.athentication.store";

const LoginForm = ({
  handleCookies,
}: {
  handleCookies: (user: any) => void;
}) => {
  const {setIsOTPSent} = useTwoAuthentication()
  const { updateSession } = useSessionStore();
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
    // setIsOTPSent(true)
    toast.promise(
      login({
        password: values.password,
        username: values.username,
      }).then(async (r) => {
        if (r.code == 1) {
          throw new Error("نام کاربری یا گذروژه نامعتبر است.", { cause: r });
        } else {
          if (r.code == 200) {
            await handleCookies(r.data as User);
            await updateSession();
          }
          return r;
        }
      }),
      {
        closeButton: true,
        loading: "درحال ورود به حساب کاربری ...",
        className: "font-estedad!",
        success: "شما با موفقیت وارد شدید !",
        duration: 2500,
        error: (r) => {
          return r.message;
        },
        description(data) {
          if (data.code == 200) {
            return "درحال انتقال, لطفا صبور باشید ..";
          }
        },
        onAutoClose(toast) {
          redirect("/");
        },
      }
    );
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
      <LoginButton onSubmit={() => {}} />
    </form>
  );
};

export default LoginForm;
