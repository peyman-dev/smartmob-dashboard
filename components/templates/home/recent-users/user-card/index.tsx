import { User } from "@/core/types/types";
import UserName from "./elements/user-name";
import JoinDate from "./elements/join-date";
import UserRole from "./elements/user-role";
import UserBalance from "./elements/user-balance";

const UserCard = ({ user }: { user: User }) => {
  console.log(user);
  return (
    <div className="h-16 text-sm! text-gray-700! font-normal! **:flex **:items-center *:gap-2  items-center grid grid-cols-4">
      <UserName user={user} />
      <JoinDate joinTimestamp={user.accountInfo.joinDate} />
      <UserRole roles={user.roles} />
      <UserBalance user={user}/>
    </div>
  );
};

export default UserCard;
