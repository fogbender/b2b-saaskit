import "../chunk-UKSPFOP7.js";
import { useCallback } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
import { invalidStateError } from "../errors";
import { createGetToken, createSignOut } from "./utils";
const useAuth = () => {
  const { sessionId, userId, actor, orgId, orgRole, orgSlug } = useAuthContext();
  const isomorphicClerk = useIsomorphicClerkContext();
  const getToken = useCallback(createGetToken(isomorphicClerk), [isomorphicClerk]);
  const signOut = useCallback(createSignOut(isomorphicClerk), [isomorphicClerk]);
  if (sessionId === void 0 && userId === void 0) {
    return {
      isLoaded: false,
      isSignedIn: void 0,
      sessionId,
      userId,
      actor: void 0,
      orgId: void 0,
      orgRole: void 0,
      orgSlug: void 0,
      signOut,
      getToken
    };
  }
  if (sessionId === null && userId === null) {
    return {
      isLoaded: true,
      isSignedIn: false,
      sessionId,
      userId,
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      signOut,
      getToken
    };
  }
  if (!!sessionId && !!userId && !!orgId && !!orgRole) {
    return {
      isLoaded: true,
      isSignedIn: true,
      sessionId,
      userId,
      actor: actor || null,
      orgId,
      orgRole,
      orgSlug: orgSlug || null,
      signOut,
      getToken
    };
  }
  if (!!sessionId && !!userId && !orgId) {
    return {
      isLoaded: true,
      isSignedIn: true,
      sessionId,
      userId,
      actor: actor || null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      signOut,
      getToken
    };
  }
  throw new Error(invalidStateError);
};
export {
  useAuth
};
//# sourceMappingURL=useAuth.js.map