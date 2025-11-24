"use client"
import React, { useState } from "react";

const useToggle = (): [isOpen: boolean, toggle: () => void] => {
  const [state, setState] = useState(false);
  const toggle = () => setState(!state);
  return [state, toggle];
};

export default useToggle;
