"use client";
import type { User } from "@/core/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UserCard from "./user-card";
import { useTranslations } from "next-intl";
import { tv } from "tailwind-variants";
import useIsEnglish from "@/core/hooks/use-is-english";

const RecentUsers = ({ users }: { users: User[] }) => {
  const t = useTranslations();
  const isEN = useIsEnglish();
  const chevron = tv({
    base: "size-4",
    variants: {
      useLTR: {
        true: "rotate-180",
      },
    },
  });
  return (
    <div className="p-4 border rounded-2xl border-zinc-200">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">{t("home.latestUsers")}</h4>

        <Link
          className="flex items-center gap-1 bg-[#FAFAFA] px-3 py-2 rounded-md text-zinc-600 text-xs"
          href={"/users"}
        >
          <span>{t("common.seeAll")}</span>
          <ChevronLeft className={chevron({ useLTR: isEN })} />
        </Link>
      </div>
      <div className="divide-y divide-zinc-200 overflow-x-auto">
        {users?.map((user) => (
          <UserCard user={user} key={user._id} />
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
