const defaultOptions = {
  firstDelay: 125,
  maxDelay: 0,
  timeMultiple: 2,
  shouldRetry: () => true
};
const sleep = async (ms) => new Promise((s) => setTimeout(s, ms));
const createExponentialDelayAsyncFn = (opts) => {
  let timesCalled = 0;
  const calculateDelayInMs = () => {
    const constant = opts.firstDelay;
    const base = opts.timeMultiple;
    const delay = constant * Math.pow(base, timesCalled);
    return Math.min(opts.maxDelay || delay, delay);
  };
  return async () => {
    await sleep(calculateDelayInMs());
    timesCalled++;
  };
};
const runWithExponentialBackOff = async (callback, options = {}) => {
  let iterationsCount = 0;
  const { shouldRetry, firstDelay, maxDelay, timeMultiple } = {
    ...defaultOptions,
    ...options
  };
  const delay = createExponentialDelayAsyncFn({ firstDelay, maxDelay, timeMultiple });
  while (true) {
    try {
      return await callback();
    } catch (e) {
      iterationsCount++;
      if (!shouldRetry(e, iterationsCount)) {
        throw e;
      }
      await delay();
    }
  }
};
export {
  runWithExponentialBackOff
};
//# sourceMappingURL=runWithExponentialBackOff.js.map