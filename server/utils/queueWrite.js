import path from 'node:path';

/**
 * @typedef {import("node:fs").PathLike | import('node:fs/promises').FileHandle} FileDescriptor
 */

/**
 * @type {Map<string, Promise<any>>}
 */
const locks = new Map();

/**
 * @param {FileDescriptor} file
 * @returns
 */
function lockKey(file) {
  if (typeof file === 'string') {
    return `path:${path.resolve(file)}`;
  }

  if (typeof file === 'number') {
    return `fd:${file}`;
  }

  return `other:${String(file)}`;
}

/**
 * @param {(file: FileDescriptor) => Promise<any>} fn
 * @param {FileDescriptor} file
 */
export default function queueWrite(fn, file) {
  const key = lockKey(file);

  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev
    .then(() => fn(file))
    .catch(() => fn(file))
    .finally(() => {
      if (locks.get(key) === next) {
        locks.delete(key);
      }
    });

  locks.set(key, next);
  return next;
}
