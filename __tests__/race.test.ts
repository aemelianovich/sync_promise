import { SyncPromise } from '../src';

describe('SyncPromise.race', () => {
  test('resolved value', async () => {
    await expect(
      SyncPromise.race([
        SyncPromise.resolve('syncPromise'),
        100,
        Promise.resolve('promise'),
        Promise.reject('Rejected promise'),
      ]),
    ).resolves.toEqual('syncPromise');
  });

  test('rejected value', async () => {
    await expect(
      SyncPromise.race([
        SyncPromise.reject('Rejected syncPromise'),
        SyncPromise.resolve('syncPromise'),
        100,
        Promise.resolve('promise'),
        Promise.reject('Rejected promise'),
      ]),
    ).rejects.toEqual('Rejected syncPromise');
  });

  test('empty input', async () => {
    await expect(SyncPromise.race([])).resolves.toEqual([]);
  });
});
