import { format } from "date-fns";

const getFormattedMonthRange = (startDate, endDate) => {
  const startMonth = format(startDate, "MMMM");
  const endMonth = format(endDate, "MMMM");
  return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
};

export default getFormattedMonthRange;
