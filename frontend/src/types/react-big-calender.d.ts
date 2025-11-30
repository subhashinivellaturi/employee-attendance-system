import { enUS } from "date-fns/locale";

export const dateFnsFormat = (date: Date, fmt: string = "yyyy-MM-dd") => {
  return date ? format(date, fmt, { locale: enUS }) : "";
};

export const dateFnsParse = (dateStr: string, fmt: string = "yyyy-MM-dd") => {
  return parse(dateStr, fmt, new Date());
};

export const dateFnsStartOfWeek = (date: Date) => {
  return startOfWeek(date, { locale: enUS });
};
