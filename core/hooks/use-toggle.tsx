"use client";
import React, { useState } from "react";

const useToggle = (
  init: boolean = false
): [boolean, (custom?: boolean) => void] => {
  const [state, setState] = useState(init);

  const toggle = (custom?: boolean) => {
    if (typeof custom === "boolean") {
      setState(custom);
    } else {
      setState((prev) => !prev);
    }
  };

  return [state, toggle];
};

export default useToggle;
