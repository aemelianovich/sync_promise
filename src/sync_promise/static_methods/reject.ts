import SyncPromise from '../sync_promise';

function reject<T>(reason: T): SyncPromise<T> {
  return new SyncPromise<T>((resolve, reject) => {
    reject(reason);
  });
}

export default reject;
