import sleep from './sleep';

function timeout<T>(value: T, ms: number): Promise<T> {
  const res = Promise.race([
    Promise.resolve(value),
    sleep(ms).then(() => {
      throw new Error('AbortError');
    }),
  ]);

  return res;
}

export default timeout;
