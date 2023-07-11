import "../chunk-UKSPFOP7.js";
import { noClerkProviderError, noGuaranteedLoadedError } from "../errors";
function assertWrappedByClerkProvider(contextVal) {
  if (!contextVal) {
    throw new Error(noClerkProviderError);
  }
}
function assertClerkLoadedGuarantee(guarantee, hookName) {
  if (!guarantee) {
    throw new Error(noGuaranteedLoadedError(hookName));
  }
}
export {
  assertClerkLoadedGuarantee,
  assertWrappedByClerkProvider
};
//# sourceMappingURL=assertHelpers.js.map