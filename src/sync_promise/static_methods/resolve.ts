import SyncPromise from '../sync_promise';

function resolve<T>(value: T): SyncPromise<T> {
  if (value instanceof SyncPromise) {
    return value;
  }
  return new SyncPromise<T>((resolve, reject) => {
    resolve(value);
  });
}

export default resolve;
