import { SyncPromise } from '../src';

describe('SyncPromise.any', () => {
  test('resolved value', async () => {
    await expect(
      SyncPromise.any([
        SyncPromise.resolve('Any syncPromise'),
        SyncPromise.reject('Rejected syncPromise'),
        100,
        Promise.resolve('promise'),
        Promise.reject('Rejected promise'),
      ]),
    ).resolves.toEqual('Any syncPromise');
  });

  test('rejected value', async () => {
    await SyncPromise.any([
      SyncPromise.reject('Rejected syncPromise'),
      SyncPromise.reject(100),
      Promise.reject('Rejected promise'),
    ]).catch((err) => {
      expect(err.message).toEqual(
        'No SymcPromise in SyncPromise.any was resolved',
      );

      expect(err.errors).toEqual([
        'Rejected syncPromise',
        100,
        'Rejected promise',
      ]);
    });
  });

  test('empty input', async () => {
    await expect(SyncPromise.any([])).resolves.toEqual([]);
  });
});
