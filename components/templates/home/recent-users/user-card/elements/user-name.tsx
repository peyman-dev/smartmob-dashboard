import { DEFAULT_AVATAR } from "@/core/lib/constants";
import { User } from "@/core/types/types";
import Image from "next/image";
import React from "react";

const UserName = ({ user }: { user: User }) => {
  return (
    <div>
      <Image
        className="rounded-full"
        src={user.accountInfo.avatar.url || DEFAULT_AVATAR}
        width={42}
        height={42}
        alt={user.personalInfo.name || user.accountInfo.name}
      />
      <span>
        {user.personalInfo.name ||
          user.accountInfo.username ||
          user.accountInfo.name}
      </span>
    </div>
  );
};

export default UserName;
