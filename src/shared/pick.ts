const pick = <T extends Record<string, unknown | number>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObject: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      if (key === 'maxPrice' || key === 'minPrice') {
        finalObject[key] = Number(obj[key]) as T[K];
      } else {
        finalObject[key] = obj[key];
      }
    }
  }
  return finalObject;
};

export default pick;
