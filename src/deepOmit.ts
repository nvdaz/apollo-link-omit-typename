export default function deepOmit(value: unknown, omitKey: string): any {
  if (Array.isArray(value)) {
    return value.map((el) => deepOmit(el, omitKey));
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => omitKey !== key)
        .map(([key, value]) => [key, deepOmit(value, omitKey)])
    );
  }

  return value;
}
