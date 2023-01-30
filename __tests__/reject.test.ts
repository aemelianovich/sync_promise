import { SyncPromise } from '../src';

describe('SyncPromise.reject', () => {
  test('rejected value', async () => {
    await expect(SyncPromise.reject(1)).rejects.toEqual(1);
  });
});
