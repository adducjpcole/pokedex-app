/**
 * @param {string} str
 */
export default function properCase(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
