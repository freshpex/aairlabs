export const isSameDay = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString();
export const isToday = (value?: string): boolean =>
  Boolean(value && isSameDay(new Date(value), new Date()));
export const isTomorrow = (value?: string): boolean => {
  if (!value) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(new Date(value), tomorrow);
};
export const isOverdue = (value?: string, completed = false): boolean =>
  Boolean(
    value &&
    !completed &&
    new Date(value).getTime() < new Date().setHours(0, 0, 0, 0),
  );
export const formatDueDate = (value?: string): string => {
  if (!value) return "";
  if (isToday(value)) return "Today";
  if (isTomorrow(value)) return "Tomorrow";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};
