import { SyncPromise } from '../src';

describe('SyncPromise.all', () => {
  test('resolved value', async () => {
    await expect(
      SyncPromise.all([
        1,
        2,
        SyncPromise.resolve('syncPromise'),
        Promise.resolve('promise'),
      ]),
    ).resolves.toEqual([1, 2, 'syncPromise', 'promise']);
  });

  test('rejected value', async () => {
    await expect(
      SyncPromise.all([
        1,
        2,
        SyncPromise.resolve('syncPromise'),
        SyncPromise.reject('Rejected syncPromise'),
        Promise.resolve('promise'),
        Promise.reject('Rejected promise'),
      ]),
    ).rejects.toEqual('Rejected syncPromise');
  });

  test('empty input', async () => {
    await expect(SyncPromise.all([])).resolves.toEqual([]);
  });
});
