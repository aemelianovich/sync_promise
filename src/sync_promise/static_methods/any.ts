/* eslint-disable @typescript-eslint/no-explicit-any */
import SyncPromise from '../sync_promise';
import type { getArrayTypes, toArray } from '../../types';

function any<
  I extends Iterable<any>,
  T extends toArray<I>, //any[] | [],
  A extends { [P in keyof T]: Awaited<T[P]> },
  V extends getArrayTypes<A>,
>(values: I): SyncPromise<V> {
  const tasks = Array.from(values);

  if (tasks.length === 0) {
    return SyncPromise.resolve(<any>[]);
  }

  return new SyncPromise((resolve, reject) => {
    const errors: any[] = [];

    for (let i = 0; i < tasks.length; i++) {
      tasks[i] = SyncPromise.resolve(tasks[i]);

      tasks[i].then(resolve).catch((reason: any) => {
        errors.push(reason);

        if (errors.length === tasks.length) {
          reject(
            new AggregateError(
              errors,
              'No SymcPromise in SyncPromise.any was resolved',
            ),
          );
        }
      });
    }
  });
}

export default any;
