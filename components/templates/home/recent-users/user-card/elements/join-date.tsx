import { localeDate } from "@/core/lib/helpers";
import "dayjs/locale/fa";
import { CalendarDays } from "lucide-react";
import React from "react";


const JoinDate = ({ joinTimestamp }: { joinTimestamp: number }) => {

  return (
    <div className="text-gray-500! md:visible md:flex items-center hidden invisible">
      <CalendarDays className="size-3.5" />
      {localeDate(joinTimestamp)}
    </div>
  );
};

export default JoinDate;
