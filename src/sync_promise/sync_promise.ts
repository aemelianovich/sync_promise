/* eslint-disable @typescript-eslint/no-explicit-any */
import StaticSyncPromise from './static_sync_promise';

type SyncPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;
type ResolveFulfilled<T, R> =
  | ((value: T) => R | PromiseLike<R>)
  | undefined
  | null;
type ResolveRejected<R> =
  | ((reason: any) => R | PromiseLike<R>)
  | undefined
  | null;

class SyncPromise<T> extends StaticSyncPromise<T> implements PromiseLike<T> {
  #value: T | undefined;
  #reason: unknown | undefined;
  #status: SyncPromiseStatus = 'pending';
  #onfulfilled: ((value?: T) => any)[] = [];
  #onrejected: ((reason?: unknown) => any)[] = [];
  #isChained = false;

  constructor(executor: (resolve: Resolve<T>, reject: Reject) => void) {
    super();
    const resolve = (value?: T | PromiseLike<T>): void => {
      if (this.#status !== 'pending') {
        return;
      }

      // Process thenable value
      const thenableValue = <PromiseLike<T>>(<any>value);
      if (thenableValue != null && typeof thenableValue.then === 'function') {
        thenableValue.then(resolve, reject);
        return;
      }

      this.#status = 'fulfilled';
      this.#value = <T>(<any>value);

      // Process all fulfilled functions
      for (const fn of this.#onfulfilled) {
        fn(this.#value);
      }
    };

    const reject = (reason: any): void => {
      if (this.#status !== 'pending') {
        return;
      }

      this.#status = 'rejected';
      this.#reason = reason;

      // Process all onrejected functions
      if (this.#onrejected.length > 0) {
        for (const fn of this.#onrejected) {
          fn(this.#reason);
        }
        // if error is not handled we need to throw a global exception
        // We will use Promise interface to imitate unhandled promise
      } else {
        queueMicrotask(() => {
          if (this.#onrejected.length === 0 && !this.#isChained) {
            Promise.reject(this.#reason);
          }
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      SyncPromise.reject(err);
    }
  }

  // We need to wrap onFulfilled function with try catch for sync values
  #wrapResolve<R>(
    resolve: Resolve<R>,
    reject: Reject,
    onFulfilled?: ResolveFulfilled<T, R>,
  ): () => void {
    const wrappedResolve = () => {
      const value = <T>this.#value;
      try {
        const res = onFulfilled ? onFulfilled(value) : value;
        resolve(<R>res);
      } catch (err) {
        reject(err);
      }
    };

    return wrappedResolve;
  }

  // We need to wrap onRejected function with try catch for sync values
  #wrapReject<R>(
    resolve: Resolve<R>,
    reject: Reject,
    onRejected?: ResolveRejected<R>,
  ): () => void {
    const wrappedReject = () => {
      try {
        onRejected ? resolve(onRejected(this.#reason)) : reject(this.#reason);
      } catch (err) {
        reject(err);
      }
    };

    return wrappedReject;
  }

  then<R, R2 = never>(
    onFulfilled?: ResolveFulfilled<T, R>,
    onRejected?: ResolveRejected<R2>,
  ): SyncPromise<R | R2> {
    this.#isChained = true;
    return new SyncPromise((resolve, reject) => {
      const wrappedResolve = this.#wrapResolve(resolve, reject, onFulfilled);
      const wrappedReject = this.#wrapReject(resolve, reject, onRejected);

      if (this.#status === 'fulfilled') {
        wrappedResolve();
        return;
      }

      if (this.#status === 'rejected') {
        wrappedReject();
        return;
      }

      // if status is pending we should add functions into array
      this.#onfulfilled.push(wrappedResolve);
      this.#onrejected.push(wrappedReject);
    });
  }

  catch<R>(onRejected?: ResolveRejected<R>): SyncPromise<R | T> {
    this.#isChained = true;
    return new SyncPromise((resolve, reject) => {
      const wrappedReject = this.#wrapReject(resolve, reject, onRejected);

      if (this.#status === 'fulfilled') {
        resolve(this.#value);
        return;
      }

      if (this.#status === 'rejected') {
        wrappedReject();
        return;
      }

      // if status is pending we should add functions into array
      this.#onfulfilled.push(resolve);
      this.#onrejected.push(wrappedReject);
    });
  }

  finally(onFinally: () => any): SyncPromise<T | never> {
    this.#isChained = true;
    return new SyncPromise((resolve, reject) => {
      // We need to make sure that SyncPromise is fulfilled or rejected with a parent value or reason
      const wrapOnFinally = (isFulfilled: boolean) => {
        return () => {
          const res = onFinally();
          if (isFulfilled) {
            // We need to wrap result with SyncPromise resolve in case if result is thenable object
            return SyncPromise.resolve(res).then(() => <T>this.#value);
          }

          return SyncPromise.resolve(res).then(() => {
            throw this.#reason;
          });
        };
      };

      const wrappedResolve = this.#wrapResolve(
        resolve,
        reject,
        wrapOnFinally(true),
      );

      const wrappedReject = this.#wrapReject(
        resolve,
        reject,
        wrapOnFinally(false),
      );

      if (this.#status === 'fulfilled') {
        wrappedResolve();
        return;
      }

      if (this.#status === 'rejected') {
        wrappedReject();
        return;
      }

      // if status is pending we should add functions into array
      this.#onfulfilled.push(wrappedResolve);
      this.#onrejected.push(wrappedReject);
    });
  }
}

export default SyncPromise;
