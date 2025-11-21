import { Input } from "antd";
import Link from "next/link";
import React from "react";

const LoginFormActions = () => {
  return (
    <div className="flex items-center *:flex select-none *:items-center *:gap-1.5 text-sm font-medium! justify-between my-8!">
      <div className="cursor-pointer">
        <input
          type="checkbox"
          id="remember-me"
          className="accent-blue-500 size-3.5"
        />
        <label htmlFor="remember-me">مرا به خاطر بسپار</label>
      </div>
      <Link href={"#"} className="text-blue-500">
        فراموشی گذرواژه
      </Link>
    </div>
  );
};

export default LoginFormActions;
