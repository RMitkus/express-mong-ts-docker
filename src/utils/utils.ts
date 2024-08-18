export function flattenObject(
  object: any,
  prefix = "",
  result: { [key: string]: any } = {},
): { [key: string]: any } {
  for (const key in object) {
    const value = object[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}
