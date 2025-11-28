import clsx from "clsx";
import { CreditCard, Eye } from "lucide-react";

interface AccountBalanceProps {
  balance: string;
  brand?: string;
  provider?: string;
  className?: string;
}

export function AccountBalance({
  balance = "$24,098.00",
  brand = "Overpay.",
  provider = "SmartMob",
  className,
}: AccountBalanceProps) {
  return (
    <div className={clsx("w-full  ", className)}>
      <div className="relative overflow-hidden rounded-3xl w-full! min-w-full! bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-8 shadow-2xl">
        <div className="absolute -top-20 -right-20 size-40 bg-white/8 rounded-full"></div>
        <div className="absolute -top-20 -right-20 size-50 bg-white/7 rounded-full"></div>
        <div className="absolute -top-20 -right-20 size-60 bg-white/5 rounded-full"></div>
        {/* Decorative background circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-blue-300 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-12">
          {/* Top row - Brand and Chip */}
          <div className="flex items-start justify-between">
            {/* Brand logo */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/90 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-blue-600" />
              </div>
              <span className="text-lg font-semibold text-white">{brand}</span>
            </div>

            {/* Chip icon */}
            <div className="rounded-lg bg-linear-to-br text-white! from-yellow-400 via-yellow-500 to-amber-600 p-3">
              <CreditCard className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Bottom section - Balance and VISA */}
          <div className="flex items-end justify-between">
            {/* VISA logo */}
            <div className="text-xl font-bold text-white italic tracking-tight">
              {provider}
            </div>

            {/* Balance */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>مبلغ</span>
              </div>
              <div className="text-2xl font-bold text-white">{balance}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
