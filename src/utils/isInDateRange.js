import parseDate from "./parseDate";

const isInDateRange = (date, startDate, endDate) => {
  const parsedStartDate = startDate ? parseDate(startDate) : undefined;
  const parsedEndDate = endDate ? parseDate(endDate) : undefined;

  if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
    console.error("Invalid date range:", startDate, "-", endDate);
    return false;
  }

  return (
    (!parsedStartDate || date >= parsedStartDate) &&
    (!parsedEndDate || date <= parsedEndDate)
  );
};

export default isInDateRange;
