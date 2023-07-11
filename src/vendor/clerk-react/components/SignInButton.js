import "../chunk-UKSPFOP7.js";
import React from "react";
import { assertSingleChild, normalizeWithDefaultValue, safeExecute } from "../utils";
import { withClerk } from "./withClerk";
const SignInButton = withClerk(({ clerk, children, ...props }) => {
  const { afterSignInUrl, afterSignUpUrl, redirectUrl, mode, ...rest } = props;
  children = normalizeWithDefaultValue(children, "Sign in");
  const child = assertSingleChild(children)("SignInButton");
  const clickHandler = () => {
    const opts = { afterSignInUrl, afterSignUpUrl, redirectUrl };
    if (mode === "modal") {
      return clerk.openSignIn(opts);
    }
    return clerk.redirectToSignIn(opts);
  };
  const wrappedChildClickHandler = async (e) => {
    await safeExecute(child.props.onClick)(e);
    return clickHandler();
  };
  const childProps = { ...rest, onClick: wrappedChildClickHandler };
  return React.cloneElement(child, childProps);
}, "SignInButton");
export {
  SignInButton
};
//# sourceMappingURL=SignInButton.js.map