import "../chunk-UKSPFOP7.js";
import { isLegacyFrontendApiKey, isPublishableKey } from "@clerk/shared";
import React from "react";
import { multipleClerkProvidersError } from "../errors";
import { __internal__setErrorThrowerOptions, errorThrower, withMaxAllowedInstancesGuard } from "../utils";
import { ClerkContextProvider } from "./ClerkContextProvider";
import { StructureContext, StructureContextStates } from "./StructureContext";
__internal__setErrorThrowerOptions({
  packageName: "@clerk/clerk-react"
});
function ClerkProviderBase(props) {
  const { initialState, children, ...restIsomorphicClerkOptions } = props;
  const { frontendApi = "", publishableKey = "", Clerk: userInitialisedClerk } = restIsomorphicClerkOptions;
  if (!userInitialisedClerk) {
    if (!publishableKey && !frontendApi) {
      errorThrower.throwMissingPublishableKeyError();
    } else if (publishableKey && !isPublishableKey(publishableKey)) {
      errorThrower.throwInvalidPublishableKeyError({ key: publishableKey });
    } else if (!publishableKey && frontendApi && !isLegacyFrontendApiKey(frontendApi)) {
      errorThrower.throwInvalidFrontendApiError({ key: frontendApi });
    }
  }
  return /* @__PURE__ */ React.createElement(StructureContext.Provider, { value: StructureContextStates.noGuarantees }, /* @__PURE__ */ React.createElement(
    ClerkContextProvider,
    {
      initialState,
      isomorphicClerkOptions: restIsomorphicClerkOptions
    },
    children
  ));
}
const ClerkProvider = withMaxAllowedInstancesGuard(ClerkProviderBase, "ClerkProvider", multipleClerkProvidersError);
ClerkProvider.displayName = "ClerkProvider";
export {
  ClerkProvider,
  __internal__setErrorThrowerOptions
};
//# sourceMappingURL=ClerkProvider.js.map