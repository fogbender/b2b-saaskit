import "../chunk-UKSPFOP7";
import React from "react";
import IsomorphicClerk from "../isomorphicClerk";
import { deriveState } from "../utils/deriveState";
import { AuthContext } from "./AuthContext";
import { ClientContext } from "./ClientContext";
import { IsomorphicClerkContext } from "./IsomorphicClerkContext";
import { OrganizationContext } from "./OrganizationContext";
import { SessionContext } from "./SessionContext";
import { UserContext } from "./UserContext";
function ClerkContextProvider(props) {
  const { isomorphicClerkOptions, initialState, children } = props;
  const { isomorphicClerk: clerk, loaded: clerkLoaded } = useLoadedIsomorphicClerk(isomorphicClerkOptions);
  const [state, setState] = React.useState({
    client: clerk.client,
    session: clerk.session,
    user: clerk.user,
    organization: clerk.organization,
    lastOrganizationInvitation: null,
    lastOrganizationMember: null
  });
  React.useEffect(() => {
    return clerk.addListener((e) => setState({ ...e }));
  }, []);
  const derivedState = deriveState(clerkLoaded, state, initialState);
  const clerkCtx = React.useMemo(() => ({ value: clerk }), [clerkLoaded]);
  const clientCtx = React.useMemo(() => ({ value: state.client }), [state.client]);
  const {
    sessionId,
    session,
    userId,
    user,
    orgId,
    actor,
    lastOrganizationInvitation,
    lastOrganizationMember,
    organization,
    orgRole,
    orgSlug
  } = derivedState;
  const authCtx = React.useMemo(() => {
    const value = { sessionId, userId, actor, orgId, orgRole, orgSlug };
    return { value };
  }, [sessionId, userId, actor, orgId, orgRole, orgSlug]);
  const userCtx = React.useMemo(() => ({ value: user }), [userId, user]);
  const sessionCtx = React.useMemo(() => ({ value: session }), [sessionId, session]);
  const organizationCtx = React.useMemo(() => {
    const value = {
      organization,
      lastOrganizationInvitation,
      lastOrganizationMember
    };
    return { value };
  }, [orgId, organization, lastOrganizationInvitation, lastOrganizationMember]);
  return (
    // @ts-expect-error
    /* @__PURE__ */ React.createElement(IsomorphicClerkContext.Provider, { value: clerkCtx }, /* @__PURE__ */ React.createElement(ClientContext.Provider, { value: clientCtx }, /* @__PURE__ */ React.createElement(SessionContext.Provider, { value: sessionCtx }, /* @__PURE__ */ React.createElement(OrganizationContext.Provider, { value: organizationCtx }, /* @__PURE__ */ React.createElement(AuthContext.Provider, { value: authCtx }, /* @__PURE__ */ React.createElement(UserContext.Provider, { value: userCtx }, children))))))
  );
}
const useLoadedIsomorphicClerk = (options) => {
  const [loaded, setLoaded] = React.useState(false);
  const isomorphicClerk = React.useMemo(() => IsomorphicClerk.getOrCreateInstance(options), []);
  React.useEffect(() => {
    isomorphicClerk.__unstable__updateProps({ appearance: options.appearance });
  }, [options.appearance]);
  React.useEffect(() => {
    isomorphicClerk.__unstable__updateProps({ options });
  }, [options.localization]);
  React.useEffect(() => {
    isomorphicClerk.addOnLoaded(() => setLoaded(true));
  }, []);
  return { isomorphicClerk, loaded };
};
export {
  ClerkContextProvider
};
//# sourceMappingURL=ClerkContextProvider.js.map
