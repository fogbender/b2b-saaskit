import "../chunk-UKSPFOP7.js";
import React from "react";
import { assertSingleChild, normalizeWithDefaultValue, safeExecute } from "../utils";
import { withClerk } from "./withClerk";
const SignInWithMetamaskButton = withClerk(
  ({ clerk, children, ...props }) => {
    const { redirectUrl, ...rest } = props;
    children = normalizeWithDefaultValue(children, "Sign in with Metamask");
    const child = assertSingleChild(children)("SignInWithMetamaskButton");
    const clickHandler = async () => {
      async function authenticate() {
        await clerk.authenticateWithMetamask({ redirectUrl });
      }
      void authenticate();
    };
    const wrappedChildClickHandler = async (e) => {
      await safeExecute(child.props.onClick)(e);
      return clickHandler();
    };
    const childProps = { ...rest, onClick: wrappedChildClickHandler };
    return React.cloneElement(child, childProps);
  },
  "SignInWithMetamask"
);
export {
  SignInWithMetamaskButton
};
//# sourceMappingURL=SignInWithMetamaskButton.js.map