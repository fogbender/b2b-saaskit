import { useClerkInstanceContext, useUserContext } from "./contexts";
const useOrganizationList = () => {
  const clerk = useClerkInstanceContext();
  const user = useUserContext();
  if (!clerk.loaded || !user) {
    return { isLoaded: false, organizationList: void 0, createOrganization: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    organizationList: createOrganizationList(user.organizationMemberships),
    setActive: clerk.setActive,
    createOrganization: clerk.createOrganization
  };
};
function createOrganizationList(organizationMemberships) {
  return organizationMemberships.map((organizationMembership) => ({
    membership: organizationMembership,
    organization: organizationMembership.organization
  }));
}
export {
  useOrganizationList
};
//# sourceMappingURL=useOrganizationList.js.map