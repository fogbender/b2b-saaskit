import { noop } from "../noop";
import pollerWorkerSource from "./workerTimers.worker";
const createWebWorker = (source, opts = {}) => {
  if (typeof Worker === "undefined") {
    return null;
  }
  try {
    const blob = new Blob([source], { type: "application/javascript; charset=utf-8" });
    const workerScript = globalThis.URL.createObjectURL(blob);
    return new Worker(workerScript, opts);
  } catch (e) {
    console.warn("Clerk: Cannot create worker from blob. Consider adding worker-src blob:; to your CSP");
    return null;
  }
};
const fallbackTimers = () => {
  const setTimeout = globalThis.setTimeout.bind(globalThis);
  const setInterval = globalThis.setInterval.bind(globalThis);
  const clearTimeout = globalThis.clearTimeout.bind(globalThis);
  const clearInterval = globalThis.clearInterval.bind(globalThis);
  return { setTimeout, setInterval, clearTimeout, clearInterval, cleanup: noop };
};
const createWorkerTimers = () => {
  let id = 0;
  const generateId = () => id++;
  const callbacks = /* @__PURE__ */ new Map();
  const post = (w, p) => w?.postMessage(p);
  const handleMessage = (e) => {
    callbacks.get(e.data.id)?.();
  };
  let worker = createWebWorker(pollerWorkerSource, { name: "clerk-timers" });
  worker?.addEventListener("message", handleMessage);
  if (!worker) {
    return fallbackTimers();
  }
  const init = () => {
    if (!worker) {
      worker = createWebWorker(pollerWorkerSource, { name: "clerk-timers" });
      worker?.addEventListener("message", handleMessage);
    }
  };
  const cleanup = () => {
    if (worker) {
      worker.terminate();
      worker = null;
      callbacks.clear();
    }
  };
  const setTimeout = (cb, ms) => {
    init();
    const id2 = generateId();
    callbacks.set(id2, cb);
    post(worker, { type: "setTimeout", id: id2, ms });
    return id2;
  };
  const setInterval = (cb, ms) => {
    init();
    const id2 = generateId();
    callbacks.set(id2, cb);
    post(worker, { type: "setInterval", id: id2, ms });
    return id2;
  };
  const clearTimeout = (id2) => {
    init();
    callbacks.delete(id2);
    post(worker, { type: "clearTimeout", id: id2 });
  };
  const clearInterval = (id2) => {
    init();
    callbacks.delete(id2);
    post(worker, { type: "clearInterval", id: id2 });
  };
  return { setTimeout, setInterval, clearTimeout, clearInterval, cleanup };
};
export {
  createWorkerTimers
};
//# sourceMappingURL=createWorkerTimers.js.map