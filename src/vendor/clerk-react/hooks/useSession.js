import "../chunk-UKSPFOP7.js";
import { useSessionContext } from "../contexts/SessionContext";
const useSession = () => {
  const session = useSessionContext();
  if (session === void 0) {
    return { isLoaded: false, isSignedIn: void 0, session: void 0 };
  }
  if (session === null) {
    return { isLoaded: true, isSignedIn: false, session: null };
  }
  return { isLoaded: true, isSignedIn: true, session };
};
export {
  useSession
};
//# sourceMappingURL=useSession.js.map