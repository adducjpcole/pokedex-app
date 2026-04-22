let writeLock = Promise.resolve();

export default function queueWrite(fn) {
  writeLock = writeLock.then(fn, fn);
  return writeLock;
}
