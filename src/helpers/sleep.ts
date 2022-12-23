function sleep<T>(ms: number, payload?: T): Promise<T | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(payload);
    }, ms);
  });
}

export default sleep;
