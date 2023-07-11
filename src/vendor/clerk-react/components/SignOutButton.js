import "../chunk-UKSPFOP7.js";
import React from "react";
import { assertSingleChild, normalizeWithDefaultValue, safeExecute } from "../utils";
import { withClerk } from "./withClerk";
const SignOutButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { signOutCallback, signOutOptions, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign out");
    const child = assertSingleChild(children)("SignOutButton");
    const clickHandler = () => {
      return clerk.signOut(signOutCallback, signOutOptions);
    };
    const wrappedChildClickHandler = async (e) => {
      await safeExecute(child.props.onClick)(e);
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SignOutButton"
);
export {
  SignOutButton
};
//# sourceMappingURL=SignOutButton.js.map