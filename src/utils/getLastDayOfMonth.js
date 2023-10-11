import { format, lastDayOfMonth, parse } from "date-fns";

const getLastDayOfMonth = (month) => {
  const date = parse(`${month} 01`, "MMMM dd", new Date());
  const lastDay = lastDayOfMonth(date);
  return format(lastDay, "dd");
};

export default getLastDayOfMonth;
