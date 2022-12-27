# SyncPromise container type

Implementation of SyncPromise container type and some usefull async functions

## SyncPromise

Sync Promise container which can work synchronically if it is possible or asynchronically
It has the same functionality as Promise container

```js
import { SyncPromise } from './src';

new SyncPromise() <
  number >
  ((resolve) => {
    resolve(1);
  }).then(console.log, console.error);

new SyncPromise((resolve) => {
  resolve(Promise.resolve(3));
})
  .then((data) => {
    console.log(data);
    throw 'SyncError';
  })
  .catch((err) => {
    console.log(err);
    return 4;
  })
  .finally(() => {
    return 'FINALLY';
  })
  .then((data) => console.log('finally:', data));

console.log(2);

// Expected output:
// 1
// 2
// 3
// SyncError
// finally: 4

SyncPromise.all([
  1,
  2,
  SyncPromise.resolve('syncPromise'),
  Promise.resolve('promise'),
]).then((res) => console.log(res));

// Expected output:
// [ 1, 2, 'syncPromise', 'promise' ]

SyncPromise.allSettled([
  1,
  2,
  SyncPromise.resolve('syncPromise'),
  SyncPromise.reject('rejectedSyncPromise'),
  Promise.resolve('promise'),
  Promise.reject('rejectedPromise'),
]).then((res) => console.log(res), console.error);

// Expected output:
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'fulfilled', value: 2 },
//   { status: 'fulfilled', value: 'syncPromise' },
//   { status: 'rejected', reason: 'rejectedSyncPromise' },
//   { status: 'fulfilled', value: 'promise' },
//   { status: 'rejected', reason: 'rejectedPromise' },
// ];

SyncPromise.race([
  SyncPromise.resolve('syncPromise'),
  100,
  Promise.resolve('promise'),
]).then((res) => console.log(res), console.error);

// Expected output:
// syncPromise

SyncPromise.any([
  SyncPromise.resolve('Any syncPromise'),
  SyncPromise.reject('Rejected syncPromise'),
  100,
  Promise.resolve('promise'),
  Promise.reject('Rejected promise'),
]).then((res) => console.log(res), console.error);

// Expected output:
// Any syncPromise

SyncPromise.any([
  SyncPromise.reject('Rejected syncPromise'),
  SyncPromise.reject(100),
  Promise.reject('Rejected promise'),
]).then(
  (res) => console.log(res),
  (err) => {
    console.error(err);
    console.error(err.errors);
  },
);

// Expected output:
// AggregateError: No SymcPromise in SyncPromise.any was resolved
// [ 'Rejected syncPromise', 100, 'Rejected promise' ]
```

## Helpers

### Sleep

Accept number of ms to wait and payload which is optional

```js
import { sleep } from './src';

sleep(5000, "I'am awake!").then((res) => {
  console.log(res);
});
```

### Timeout

Accept number of ms after which we should reject execution with ''Execution timeout error'

```js
import { sleep, timeout } from './src';

timeout(sleep(8000, 'success'), 3000).then(console.log).catch(console.error); // 'Execution timeout error'
timeout(sleep(3000, 'success2'), 5000).then(console.log).catch(console.error); // success2
```

### setImmediateCustom, clearImmediateCustom

It is an imitation of node js setImmediate and clearImmediate functions

```js
import { setImmediateCustom, setImmediateCustom } from './src';

const id = setImmediateCustom((res) => console.log(res), 'Test 1'); // No Output
setImmediateCustom((res) => console.log(res), 'Test 2'); // Test 2
clearImmediateCustom(id);
```

### Promisify

Convert a function with thunk-callback to the function that returns promise

```js
import { promisify } from './src';

function readFile(file: string, cb: (err: unknown, data: string) => void) {
  cb(null, 'fileContent');
}

const readFilePromise = promisify(readFile);
readFilePromise('my-file.txt').then(console.log).catch(console.error); // fileContent
```
