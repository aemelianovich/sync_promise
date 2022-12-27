/* eslint-disable @typescript-eslint/no-explicit-any */

function promisify<
  T extends (...args: any[]) => any,
  P extends Parameters<T> extends [
    ...args: infer A,
    cb: (err: unknown, data: any) => void,
  ]
    ? A
    : never,
  F extends Parameters<T> extends [
    ...args: any[],
    cb: infer C extends (err: unknown, data: any) => void,
  ]
    ? C
    : never,
  D extends Parameters<F> extends [err: unknown, data: infer D] ? D : never,
>(fn: T): (...args: P) => Promise<D> {
  return function (...args: P): Promise<D> {
    if (fn.length - 1 !== args.length) {
      throw new Error(`Invalid number of arguments for function "${fn.name}"`);
    }
    return new Promise((resolve, reject) => {
      fn(...args, (err: unknown, data: D) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  };
}

export default promisify;
