function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) {
    return base;
  }

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const merged: Record<string, unknown> = { ...base };
    const keys = new Set([...Object.keys(base), ...Object.keys(override)]);

    for (const key of keys) {
      const baseValue = (base as Record<string, unknown>)[key];
      const overrideValue = override[key];

      if (overrideValue === undefined) {
        merged[key] = baseValue;
        continue;
      }

      if (baseValue === undefined) {
        merged[key] = overrideValue;
        continue;
      }

      merged[key] = deepMerge(baseValue, overrideValue);
    }

    return merged as T;
  }

  return override as T;
}

