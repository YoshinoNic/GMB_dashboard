import { format } from "date-fns";

const parseDate = (dateStr) => {
  if (!dateStr) return undefined;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error("Failed to parse date string:", dateStr);
    return undefined;
  }

  return format(date, "yyyy-MM-dd");
};

export default parseDate;
