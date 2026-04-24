/**
 * @template {{ id: number }} T
 * @param {Array<T>} list
 */
export default function getMaxId(list) {
  return list.reduce((max, p) => Math.max(max, p.id ?? 0), 0);
}
