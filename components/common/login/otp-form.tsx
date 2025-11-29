"use client";
import React, { useState } from "react";
import DynamicAuthHeader from "../../templates/auth/common/dynamic-auth-header";
import { Button, Input } from "antd";
import { useTwoAuthentication } from "@/core/stores/two.authentication.store";
import Countdown from "react-countdown";
import { login } from "@/core/actions";
import { toast } from "sonner";
import { User } from "@/core/types/types";
import { useSessionStore } from "@/core/stores/auth.store";
import { redirect } from "next/navigation";
const padZero = (num: number) => String(num).padStart(2, "0");

const OTPForm = ({writeCookies}: {writeCookies: (user: User) => void}) => {
  const {updateSession} = useSessionStore()
  const { setIsOTPSent } = useTwoAuthentication();
  const { password, username } = useTwoAuthentication();
  // این state باعث می‌شه هر بار resend بزنی، تایمر ریستارت بشه
  const [countdownKey, setCountdownKey] = useState<number>(Date.now());

  const resendCode = async () => {
    const res = await login({
      username,
      password,
    });

    if (res.code == 4) {
      toast.info("کد یکبار مصرف برای شما ارسال شده است");
    } else if (res.code == 201) {
      toast.success("کد یکبارمصرف برای شما ارسال گردید!");
    }

    setCountdownKey(Date.now());
  };

  const renderer = ({
    minutes,
    seconds,
    completed,
  }: {
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return (
        <Button variant="link" onClick={resendCode} type="link">
          ارسال مجدد
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center font-mono" dir="ltr">
        <span>{padZero(minutes)}</span>:<span>{padZero(seconds)}</span>
      </div>
    );
  };

  return (
    <form className="space-y-4 container md:w-[60%]! w-full *:w-full! h-dvh flex items-center justify-center! *:max-h-max! flex-col">
      <DynamicAuthHeader />
      <div className="flex items-center flex-col gap-2 justify-center my-5">
        <p className="text-xs text-zinc-500">
          لطفا کد 6رقمی ارسال شده را وارد کنید
        </p>
        <Input.OTP
          length={6}
          autoFocus
          dir="ltr"
          onChange={async (val) => {
            console.log(val);
            const res = await login({
              username,
              password,
              code: val
            });


            if (res.code == 200) {
              toast.success("شما با موفقیت وارد شدید", {
                position: "top-right"
              })
              await writeCookies(res?.data)
              await updateSession()
              await redirect("/")
            } else {
              toast.error("ورود ناموفق بود !")
            }

            // هر بار resend زدی، key رو عوض کن → Countdown دوباره mount می‌شه
            setCountdownKey(Date.now());
          }}
        />

        <div className="flex items-center justify-center text-sm grow w-full! mt-3!">
          <Countdown
            key={countdownKey} // ← این خط مهمه! هر بار key عوض شه = تایمر از اول
            date={Date.now() + 5 * 60 * 1000}
            renderer={renderer}
            autoStart={true}
          />
        </div>
      </div>

      <div className="text-center space-y-2.5!">
        <Button
          color="blue"
          variant="solid"
          className="w-full h-12! text-white"
        >
          تائید و ادامه
        </Button>
        <Button
          onClick={() => setIsOTPSent(false)}
          type="link"
          color="blue"
          size="small"
        >
          بازگشت
        </Button>
      </div>
    </form>
  );
};

export default OTPForm;
