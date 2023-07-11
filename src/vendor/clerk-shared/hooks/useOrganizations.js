import { useClerkInstanceContext } from "./contexts";
const useOrganizations = () => {
  const clerk = useClerkInstanceContext();
  if (!clerk.loaded) {
    return {
      isLoaded: false,
      createOrganization: void 0,
      getOrganizationMemberships: void 0,
      getOrganization: void 0
    };
  }
  return {
    isLoaded: true,
    createOrganization: clerk.createOrganization,
    getOrganizationMemberships: clerk.getOrganizationMemberships,
    getOrganization: clerk.getOrganization
  };
};
export {
  useOrganizations
};
//# sourceMappingURL=useOrganizations.js.map