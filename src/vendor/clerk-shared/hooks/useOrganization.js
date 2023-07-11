import useSWR from "swr";
import { useClerkInstanceContext, useOrganizationContext, useSessionContext } from "./contexts";
const useOrganization = (params) => {
  const { invitationList: invitationListParams, membershipList: membershipListParams } = params || {};
  const { organization, lastOrganizationMember, lastOrganizationInvitation } = useOrganizationContext();
  const session = useSessionContext();
  const clerk = useClerkInstanceContext();
  const shouldFetch = clerk.loaded && session && organization;
  const pendingInvitations = !clerk.loaded ? () => [] : () => clerk.organization?.getPendingInvitations(invitationListParams);
  const currentOrganizationMemberships = !clerk.loaded ? () => [] : () => clerk.organization?.getMemberships(membershipListParams);
  const {
    data: invitationList,
    isValidating: isInvitationsLoading,
    mutate: mutateInvitationList
  } = useSWR(
    shouldFetch && invitationListParams ? cacheKey("invites", organization, lastOrganizationInvitation, invitationListParams) : null,
    pendingInvitations
  );
  const {
    data: membershipList,
    isValidating: isMembershipsLoading,
    mutate: mutateMembershipList
  } = useSWR(
    shouldFetch && membershipListParams ? cacheKey("memberships", organization, lastOrganizationMember, membershipListParams) : null,
    currentOrganizationMemberships
  );
  if (organization === void 0) {
    return {
      isLoaded: false,
      organization: void 0,
      invitationList: void 0,
      membershipList: void 0,
      membership: void 0
    };
  }
  if (organization === null) {
    return {
      isLoaded: true,
      organization: null,
      invitationList: null,
      membershipList: null,
      membership: null
    };
  }
  if (!clerk.loaded && organization) {
    return {
      isLoaded: true,
      organization,
      invitationList: void 0,
      membershipList: void 0,
      membership: void 0
    };
  }
  return {
    isLoaded: !isMembershipsLoading && !isInvitationsLoading,
    organization,
    membershipList,
    membership: getCurrentOrganizationMembership(session.user.organizationMemberships, organization.id),
    // your membership in the current org
    invitationList,
    unstable__mutate: () => {
      void mutateMembershipList();
      void mutateInvitationList();
    }
  };
};
function getCurrentOrganizationMembership(organizationMemberships, activeOrganizationId) {
  return organizationMemberships.find(
    (organizationMembership) => organizationMembership.organization.id === activeOrganizationId
  );
}
function cacheKey(type, organization, resource, pagination) {
  return [type, organization.id, resource?.id, resource?.updatedAt, pagination.offset, pagination.limit].filter(Boolean).join("-");
}
export {
  useOrganization
};
//# sourceMappingURL=useOrganization.js.map