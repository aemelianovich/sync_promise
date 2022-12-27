import { SyncPromise } from '../src';

describe('SyncPromise methods', () => {
  test('then, catch, finally', async () => {
    await new SyncPromise((resolve) => {
      resolve(Promise.resolve(3));
    })
      .then((data) => {
        expect(data).toEqual(3);
        throw 'SyncError';
      })
      .catch((err) => {
        expect(err).toEqual('SyncError');
        return 4;
      })
      .finally(() => {
        return 'FINALLY';
      })
      .then((data) => {
        expect(data).toEqual(4);
      });

    await new SyncPromise((resolve) => {
      resolve(Promise.resolve(3));
    })
      .then((data) => {
        expect(data).toEqual(3);
        throw 'SyncError';
      })
      .catch((err) => {
        expect(err).toEqual('SyncError');
        return 4;
      })
      .finally(() => {
        throw 'Finally Error';
        return 'FINALLY';
      })
      .then((data) => {
        expect(data).toEqual(4);
      })
      .catch((err) => {
        expect(err).toEqual('Finally Error');
      });
  });
});
