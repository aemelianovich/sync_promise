/* eslint-disable @typescript-eslint/no-explicit-any */
function setImmediateCustom(
  fn: (...args: any[]) => any,
  ...args: any[]
): AbortController {
  const controller = new AbortController();

  queueMicrotask(() => {
    if (!controller.signal.aborted) {
      fn(...args);
    }
  });

  return controller;
}

function clearImmediateCustom(controller: AbortController): void {
  controller.abort();
}

export { setImmediateCustom, clearImmediateCustom };
