/* eslint-disable @typescript-eslint/no-explicit-any */
import SyncPromise from '../sync_promise';
import type { getArrayTypes, toArray } from '../../types';

function race<
  I extends Iterable<any>,
  T extends toArray<I>,
  A extends { [P in keyof T]: Awaited<T[P]> },
  V extends getArrayTypes<A>,
>(values: I): SyncPromise<V> {
  const tasks = Array.from(values);

  if (tasks.length === 0) {
    return SyncPromise.resolve(<any>[]);
  }

  return new SyncPromise((resolve, reject) => {
    for (let i = 0; i < tasks.length; i++) {
      SyncPromise.resolve(tasks[i]).then(resolve, reject);
    }
  });
}

export default race;
