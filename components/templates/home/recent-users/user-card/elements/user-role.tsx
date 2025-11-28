import { User } from "@/core/types/types";
import { Tag } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";

const UserRole = ({
  roles,
  className,
}: {
  roles: User["roles"];
  className?: string;
}) => {
  const t = useTranslations("common.userRole");
  if (roles.manager) {
    return (
      <Tag
        className={clsx("text-xs max-w-max! font-estedad!", className)}
        color="green"
      >
        {t(`manager`)}
      </Tag>
    );
  }
  if (roles.admin) {
    return (
      <Tag
        className={clsx("text-xs max-w-max! font-estedad!", className)}
        color="blue"
      >
        {t(`admin`)}
      </Tag>
    );
  }
  if (roles.ghost) {
    return (
      <Tag
        className={clsx("text-xs max-w-max! font-estedad!", className)}
        color="default"
      >
        {t(`ghost`)}
      </Tag>
    );
  }
  return null;
};

export default UserRole;
