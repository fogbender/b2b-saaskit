import React from "react";
function assertContextExists(contextVal, msgOrCtx) {
  if (!contextVal) {
    throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : new Error(`${msgOrCtx.displayName} not found`);
  }
}
const createContextAndHook = (displayName, options) => {
  const { assertCtxFn = assertContextExists } = options || {};
  const Ctx = React.createContext(void 0);
  Ctx.displayName = displayName;
  const useCtx = () => {
    const ctx = React.useContext(Ctx);
    assertCtxFn(ctx, `${displayName} not found`);
    return ctx.value;
  };
  const useCtxWithoutGuarantee = () => {
    const ctx = React.useContext(Ctx);
    return ctx ? ctx.value : {};
  };
  return [Ctx, useCtx, useCtxWithoutGuarantee];
};
export {
  assertContextExists,
  createContextAndHook
};
//# sourceMappingURL=createContextAndHook.js.map