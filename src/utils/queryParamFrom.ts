export const queryParamFrom = (
  key: string,
  query: Partial<{ [key: string]: string | string[] }>
): string => {
  const value = query[key];
  if (value === undefined) return "";
  if (!Array.isArray(value)) return value;
  return value[0] ?? "";
};
