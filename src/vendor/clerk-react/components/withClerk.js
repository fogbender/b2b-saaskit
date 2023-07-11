import "../chunk-UKSPFOP7.js";
import React from "react";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
import { LoadedGuarantee } from "../contexts/StructureContext";
import { hocChildrenNotAFunctionError } from "../errors";
const withClerk = (Component, displayName) => {
  displayName = displayName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const HOC = (props) => {
    const clerk = useIsomorphicClerkContext();
    if (!clerk.loaded) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(LoadedGuarantee, null, /* @__PURE__ */ React.createElement(
      Component,
      {
        ...props,
        clerk
      }
    ));
  };
  HOC.displayName = `withClerk(${displayName})`;
  return HOC;
};
const WithClerk = ({ children }) => {
  const clerk = useIsomorphicClerkContext();
  if (typeof children !== "function") {
    throw new Error(hocChildrenNotAFunctionError);
  }
  if (!clerk.loaded) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(LoadedGuarantee, null, children(clerk));
};
export {
  WithClerk,
  withClerk
};
//# sourceMappingURL=withClerk.js.map