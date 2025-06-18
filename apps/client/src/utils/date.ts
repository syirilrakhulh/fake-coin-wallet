import { type DateArg, format } from 'date-fns';

export const formatDate = (date: DateArg<Date>, formatString?: string) => {
  return format(date, formatString ?? 'PPpp');
};
