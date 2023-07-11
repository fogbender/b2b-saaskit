import { noop } from "./noop";
const createDeferredPromise = () => {
  let resolve = noop;
  let reject = noop;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
export {
  createDeferredPromise
};
//# sourceMappingURL=createDeferredPromise.js.map