import "../chunk-UKSPFOP7.js";
import React from "react";
import { useSessionContext } from "../contexts/SessionContext";
import { hocChildrenNotAFunctionError } from "../errors";
const withSession = (Component, displayName) => {
  displayName = displayName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const HOC = (props) => {
    const session = useSessionContext();
    if (!session) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(
      Component,
      {
        ...props,
        session
      }
    );
  };
  HOC.displayName = `withSession(${displayName})`;
  return HOC;
};
const WithSession = ({ children }) => {
  const session = useSessionContext();
  if (typeof children !== "function") {
    throw new Error(hocChildrenNotAFunctionError);
  }
  if (!session) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children(session));
};
export {
  WithSession,
  withSession
};
//# sourceMappingURL=withSession.js.map