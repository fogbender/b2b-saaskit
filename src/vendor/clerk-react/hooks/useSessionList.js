import "../chunk-UKSPFOP7.js";
import { useClientContext } from "../contexts/ClientContext";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
const useSessionList = () => {
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = useClientContext();
  if (!client) {
    return { isLoaded: false, sessions: void 0, setSession: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    sessions: client.sessions,
    setSession: isomorphicClerk.setSession,
    setActive: isomorphicClerk.setActive
  };
};
export {
  useSessionList
};
//# sourceMappingURL=useSessionList.js.map