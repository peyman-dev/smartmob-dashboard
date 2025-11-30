"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { Tooltip } from "antd";
import { memo, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { dynamicDirection } from "@/core/lib/helpers";

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
}: CopyableProps) => {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const directionProps = useMemo(() => dynamicDirection(), []);

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
    <Tooltip title={copied ? t("copied") : t("clickToCopy")}>
      <div {...directionProps} onClick={handleCopy}>
        {copied ? (
          <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
        ) : (
          <Copy className="size-4 text-neutral-600 flex-shrink-0" />
        )}
        {children ? children : <span ref={ref}>{text}</span>}
      </div>
    </Tooltip>
  );
};

export default memo(Copyable);
