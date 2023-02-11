import { addMonths, formatISO, parseISO } from "date-fns";

export const addMonthsIso = (isoDate = "", months = 0) => {
  const date = parseISO(isoDate);
  const month = addMonths(date, months);
  return formatISO(month, {
    representation: "date",
  });
};

export const isValidIso = (date) => {
  return /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};
