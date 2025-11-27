"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { Tooltip } from "antd";
import { useRef, useState, type ReactNode } from "react";

interface CopyableProps {
  text: string;
  children?: ReactNode;
  tooltipCopy?: string;
  tooltipCopied?: string;
  className?: string;
}

const Copyable = ({
  text,
  children,
  tooltipCopy = "کلیک برای کپی",
  tooltipCopied = "کپی شد!",
  className = "",
}: CopyableProps) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const range = document.createRange();
      if (ref.current) {
        range.selectNodeContents(ref.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        document.execCommand("copy");
        sel?.removeAllRanges();
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? tooltipCopied : tooltipCopy}>
      <div
        onClick={handleCopy}
     
      >
        {copied ? (
          <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
        ) : (
          <Copy className="size-4 text-neutral-600 flex-shrink-0" />
        )}
        {children ? (
        children
      ) : (
        <span ref={ref}>{text}</span>
      )}
      </div>
    </Tooltip>
  );
};

export default Copyable;