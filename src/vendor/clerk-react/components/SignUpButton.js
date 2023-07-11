import "../chunk-UKSPFOP7.js";
import React from "react";
import { assertSingleChild, normalizeWithDefaultValue, safeExecute } from "../utils";
import { withClerk } from "./withClerk";
const SignUpButton = withClerk(({ clerk, children, ...props }) => {
  const { afterSignInUrl, afterSignUpUrl, redirectUrl, mode, ...rest } = props;
  children = normalizeWithDefaultValue(children, "Sign up");
  const child = assertSingleChild(children)("SignUpButton");
  const clickHandler = () => {
    const opts = { afterSignInUrl, afterSignUpUrl, redirectUrl };
    if (mode === "modal") {
      return clerk.openSignUp(opts);
    }
    return clerk.redirectToSignUp(opts);
  };
  const wrappedChildClickHandler = async (e) => {
    await safeExecute(child.props.onClick)(e);
    return clickHandler();
  };
  const childProps = { ...rest, onClick: wrappedChildClickHandler };
  return React.cloneElement(child, childProps);
}, "SignUpButton");
export {
  SignUpButton
};
//# sourceMappingURL=SignUpButton.js.map