import dayjs from "dayjs";
import "dayjs/locale/fa";
import jalaliday from "jalaliday";
import { CalendarDays } from "lucide-react";
import React from "react";

dayjs.extend(jalaliday);

const JoinDate = ({ joinTimestamp }: { joinTimestamp: number }) => {
  const persianDate = dayjs(joinTimestamp)
    .calendar("jalali")
    .locale("fa")
    .format("D MMMM YYYY");

  return (
    <div className="text-gray-500!">
      <CalendarDays className="size-3.5" />
      {persianDate}
    </div>
  );
};

export default JoinDate;
