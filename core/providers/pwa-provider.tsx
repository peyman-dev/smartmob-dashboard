import InstallPWA from "@/components/common/install-pwa";
import React, { ReactNode } from "react";

const PWAProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <InstallPWA />
    </>
  );
};

export default PWAProvider;
