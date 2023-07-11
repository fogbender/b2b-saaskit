import { createContextAndHook } from "./createContextAndHook";
const [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
const [UserContext, useUserContext] = createContextAndHook("UserContext");
const [ClientContext, useClientContext] = createContextAndHook("ClientContext");
const [SessionContext, useSessionContext] = createContextAndHook(
  "SessionContext"
);
const [OrganizationContext, useOrganizationContext] = createContextAndHook("OrganizationContext");
export {
  ClerkInstanceContext,
  ClientContext,
  OrganizationContext,
  SessionContext,
  UserContext,
  useClerkInstanceContext,
  useClientContext,
  useOrganizationContext,
  useSessionContext,
  useUserContext
};
//# sourceMappingURL=contexts.js.map