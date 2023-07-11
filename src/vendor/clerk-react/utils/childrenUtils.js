import "../chunk-UKSPFOP7.js";
import React from "react";
import { multipleChildrenInButtonComponent } from "../errors";
const assertSingleChild = (children) => (name) => {
  try {
    return React.Children.only(children);
  } catch (e) {
    throw new Error(multipleChildrenInButtonComponent(name));
  }
};
const normalizeWithDefaultValue = (children, defaultText) => {
  if (!children) {
    children = defaultText;
  }
  if (typeof children === "string") {
    children = /* @__PURE__ */ React.createElement("button", null, children);
  }
  return children;
};
const safeExecute = (cb) => (...args) => {
  if (cb && typeof cb === "function") {
    return cb(...args);
  }
};
export {
  assertSingleChild,
  normalizeWithDefaultValue,
  safeExecute
};
//# sourceMappingURL=childrenUtils.js.map