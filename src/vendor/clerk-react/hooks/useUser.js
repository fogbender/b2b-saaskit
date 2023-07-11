import "../chunk-UKSPFOP7.js";
import { useUserContext } from "../contexts/UserContext";
function useUser() {
  const user = useUserContext();
  if (user === void 0) {
    return { isLoaded: false, isSignedIn: void 0, user: void 0 };
  }
  if (user === null) {
    return { isLoaded: true, isSignedIn: false, user: null };
  }
  return { isLoaded: true, isSignedIn: true, user };
}
export {
  useUser
};
//# sourceMappingURL=useUser.js.map