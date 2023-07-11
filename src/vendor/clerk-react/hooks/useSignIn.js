import "../chunk-UKSPFOP7.js";
import { useClientContext } from "../contexts/ClientContext";
import { useIsomorphicClerkContext } from "../contexts/IsomorphicClerkContext";
const useSignIn = () => {
  const isomorphicClerk = useIsomorphicClerkContext();
  const client = useClientContext();
  if (!client) {
    return { isLoaded: false, signIn: void 0, setSession: void 0, setActive: void 0 };
  }
  return {
    isLoaded: true,
    signIn: client.signIn,
    setSession: isomorphicClerk.setSession,
    setActive: isomorphicClerk.setActive
  };
};
export {
  useSignIn
};
//# sourceMappingURL=useSignIn.js.map