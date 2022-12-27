import { SyncPromise } from '../src';

describe('SyncPromise.resolve', () => {
  test('resolved value', async () => {
    await expect(SyncPromise.resolve(1)).resolves.toEqual(1);
  });
});
