import { create } from "zustand";

interface IProps {
    isOTPSent: boolean,
    setIsOTPSent: (isOTPSent: boolean) => void;
    OTPCode: number,
    setOTPCode: (OTPCode: number) => void;
    status:  "none" | "pending" | "done",
}

export const useTwoAuthentication = create<IProps>((set) => ({
  isOTPSent: false,
  setIsOTPSent: (isOTPSent) => set({ isOTPSent }),
  OTPCode: 0,
  setOTPCode: (OTPCode) => set({OTPCode}),
  status: "none"
}));



