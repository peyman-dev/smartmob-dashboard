/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

const WithError = ({
  children,
  error,
}: {
  children: ReactNode;
  error?: string | null;
}) => {
  return (
    <div>
      {children}
      {error?.length && <p className="text-xs before:content-['*'] text-red-600 mt-1 select-none">{error}</p>}
    </div>
  );
};

export default WithError;
