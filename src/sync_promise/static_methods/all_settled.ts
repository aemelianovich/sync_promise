/* eslint-disable @typescript-eslint/no-explicit-any */
import SyncPromise from '../sync_promise';
import type { getArrayTypes, toArray } from '../../types';

function allSettled<
  I extends Iterable<any>,
  T extends toArray<I>, //any[] | [],
  A extends { [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> },
  V extends getArrayTypes<T>,
>(values: I): SyncPromise<A> {
  const tasks = Array.from(values);

  if (tasks.length === 0) {
    return SyncPromise.resolve(<any>[]);
  }

  return new SyncPromise((resolve, reject) => {
    const results = new Array(tasks.length);
    let done = 0;
    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = SyncPromise.resolve(tasks[i]);

      tasks[i]
        .then((value: V) => {
          results[i] = { status: 'fulfilled', value };
          done++;

          if (done === tasks.length) {
            resolve(<A>(<unknown>results));
          }
        })
        .catch((reason: any) => {
          results[i] = { status: 'rejected', reason };
          done++;

          if (done === tasks.length) {
            resolve(<A>(<unknown>results));
          }
        });
    }
  });
}

export default allSettled;
