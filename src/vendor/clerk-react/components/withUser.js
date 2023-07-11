import "../chunk-UKSPFOP7.js";
import React from "react";
import { useUserContext } from "../contexts/UserContext";
import { hocChildrenNotAFunctionError } from "../errors";
const withUser = (Component, displayName) => {
  displayName = displayName || Component.displayName || Component.name || "Component";
  Component.displayName = displayName;
  const HOC = (props) => {
    const user = useUserContext();
    if (!user) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(
      Component,
      {
        ...props,
        user
      }
    );
  };
  HOC.displayName = `withUser(${displayName})`;
  return HOC;
};
const WithUser = ({ children }) => {
  const user = useUserContext();
  if (typeof children !== "function") {
    throw new Error(hocChildrenNotAFunctionError);
  }
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children(user));
};
export {
  WithUser,
  withUser
};
//# sourceMappingURL=withUser.js.map