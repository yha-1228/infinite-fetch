export function mergeData<T>(prev: T[] | undefined, fetched: T[] | undefined) {
  if (!prev) return fetched;
  if (!fetched) return prev;
  return [...prev, ...fetched];
}
