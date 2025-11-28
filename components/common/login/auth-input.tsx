"use client"
import { Input, InputProps } from "antd";
import clsx from "clsx";

const AuthInput = (inputProps: InputProps) => {
  return (
    <div className="grow">
      <Input
      {...inputProps}
        className={clsx("w-full h-14 **:font-estedad! placeholder:font-estedad!", inputProps?.className)}
      />
    </div>
  );
};

export default AuthInput;
