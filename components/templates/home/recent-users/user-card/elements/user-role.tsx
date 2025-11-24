import { User } from "@/core/types/types";
import { Tag } from "antd";

const UserRole = ({ roles }: { roles: User["roles"] }) => {
  if (roles.manager) {
    return <Tag className="text-xs max-w-max! font-estedad!" color="green">مدیر</Tag>;
  }
  if (roles.admin) {
    return <Tag className="text-xs max-w-max! font-estedad!" color="blue">ادمین</Tag>;
  }
  if (roles.ghost) {
    return <Tag className="text-xs max-w-max! font-estedad!" color="default">کاربر مهمان</Tag>;
  }
  return null;
};

export default UserRole;