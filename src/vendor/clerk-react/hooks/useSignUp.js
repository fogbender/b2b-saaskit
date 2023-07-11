import "../chunk-UKSPFOP7.js";
import { useClientContext } from "../contexts/ClientContext";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
const useSignUp = () => {
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = useClientContext();
  if (!client) {
    return { isLoaded: false, signUp: void 0, setSession: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    signUp: client.signUp,
    setSession: isomorphicClerk.setSession,
    setActive: isomorphicClerk.setActive
  };
};
export {
  useSignUp
};
//# sourceMappingURL=useSignUp.js.map