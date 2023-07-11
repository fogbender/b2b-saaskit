import "../chunk-UKSPFOP7.js";
import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
import { useSessionContext } from "../contexts/SessionContext";
import { LoadedGuarantee } from "../contexts/StructureContext";
import { withClerk } from "./withClerk";
const SignedIn = ({ children }) => {
  const { userId } = useAuthContext();
  if (userId) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return null;
};
const SignedOut = ({ children }) => {
  const { userId } = useAuthContext();
  if (userId === null) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return null;
};
const ClerkLoaded = ({ children }) => {
  const isomorphicClerk = useIsomorphicClerkContext();
  if (!isomorphicClerk.loaded) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(LoadedGuarantee, null, children);
};
const ClerkLoading = ({ children }) => {
  const isomorphicClerk = useIsomorphicClerkContext();
  if (isomorphicClerk.loaded) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};
const RedirectToSignIn = withClerk(({ clerk, ...props }) => {
  const { client, session } = clerk;
  const { __unstable__environment } = clerk;
  const hasActiveSessions = client.activeSessions && client.activeSessions.length > 0;
  React.useEffect(() => {
    if (session === null && hasActiveSessions && __unstable__environment) {
      const { afterSignOutOneUrl } = __unstable__environment.displayConfig;
      void clerk.navigate(afterSignOutOneUrl);
    } else {
      void clerk.redirectToSignIn(props);
    }
  }, []);
  return null;
}, "RedirectToSignIn");
const RedirectToSignUp = withClerk(({ clerk, ...props }) => {
  React.useEffect(() => {
    void clerk.redirectToSignUp(props);
  }, []);
  return null;
}, "RedirectToSignUp");
const RedirectToUserProfile = withClerk(({ clerk }) => {
  React.useEffect(() => {
    clerk.redirectToUserProfile();
  }, []);
  return null;
}, "RedirectToUserProfile");
const RedirectToOrganizationProfile = withClerk(({ clerk }) => {
  React.useEffect(() => {
    clerk.redirectToOrganizationProfile();
  }, []);
  return null;
}, "RedirectToOrganizationProfile");
const RedirectToCreateOrganization = withClerk(({ clerk }) => {
  React.useEffect(() => {
    clerk.redirectToCreateOrganization();
  }, []);
  return null;
}, "RedirectToCreateOrganization");
const AuthenticateWithRedirectCallback = withClerk(
  ({ clerk, ...handleRedirectCallbackParams }) => {
    React.useEffect(() => {
      void clerk.handleRedirectCallback(handleRedirectCallbackParams);
    }, []);
    return null;
  },
  "AuthenticateWithRedirectCallback"
);
const MultisessionAppSupport = ({ children }) => {
  const session = useSessionContext();
  return /* @__PURE__ */ React.createElement(React.Fragment, { key: session ? session.id : "no-users" }, children);
};
export {
  AuthenticateWithRedirectCallback,
  ClerkLoaded,
  ClerkLoading,
  MultisessionAppSupport,
  RedirectToCreateOrganization,
  RedirectToOrganizationProfile,
  RedirectToSignIn,
  RedirectToSignUp,
  RedirectToUserProfile,
  SignedIn,
  SignedOut
};
//# sourceMappingURL=controlComponents.js.map