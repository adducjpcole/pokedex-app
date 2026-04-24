/**
 * @template T
 * @param {string | T} value
 * @param {T} fallback
 * @returns {T}
 */
export default function parseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;

  if (typeof value === 'string') {
    try {
      return /** @type {T} */ (JSON.parse(value));
    } catch {
      return fallback;
    }
  }

  return value;
}
