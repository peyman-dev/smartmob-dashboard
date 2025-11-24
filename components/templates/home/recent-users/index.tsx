"use client";
import { User } from "@/core/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserCard from "./user-card";

const RecentUsers = ({ users }: { users: User[] }) => {
  console.log(users);
  return (
    <div className="p-4 border rounded-2xl border-zinc-200">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">جدیدترین کاربران</h4>
        <Link
          className="flex items-center gap-1 bg-[#FAFAFA] px-3 py-2 rounded-md text-zinc-600 text-xs"
          href={"/users"}
        >
          <span>مشاهده کامل</span>
          <ChevronLeft className="size-4" />
        </Link>
      </div>
      <div className="divide-y divide-zinc-200">
        {users?.map((user) => <UserCard user={user} key={user._id}/>)}
      </div>
    </div>
  );
};

export default RecentUsers;
