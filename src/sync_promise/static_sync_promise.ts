import { resolve, reject, all, allSettled, race, any } from './static_methods';

class StaticSyncPromise<T> {
  static reject = reject;
  static resolve = resolve;
  static all = all;
  static allSettled = allSettled;
  static race = race;
  static any = any;
}

export default StaticSyncPromise;
