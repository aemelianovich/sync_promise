import { SyncPromise } from '../src';

describe('SyncPromise.allSettled', () => {
  test('resolved value', async () => {
    await expect(
      SyncPromise.allSettled([
        1,
        2,
        SyncPromise.resolve('syncPromise'),
        SyncPromise.reject('rejectedSyncPromise'),
        Promise.resolve('promise'),
        Promise.reject('rejectedPromise'),
      ]),
    ).resolves.toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 'syncPromise' },
      { status: 'rejected', reason: 'rejectedSyncPromise' },
      { status: 'fulfilled', value: 'promise' },
      { status: 'rejected', reason: 'rejectedPromise' },
    ]);
  });

  test('empty input', async () => {
    await expect(SyncPromise.allSettled([])).resolves.toEqual([]);
  });
});
