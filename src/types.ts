/* eslint-disable @typescript-eslint/no-explicit-any */
type getArrayTypes<A extends any[]> = A extends (infer V)[] ? V : unknown;

type toArray<I extends Iterable<any>> = I extends Iterable<infer V>
  ? V[]
  : unknown;

export { getArrayTypes, toArray };
