import { isomorphicAtob } from "./isomorphicAtob";
const PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
const PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
const PUBLISHABLE_FRONTEND_API_DEV_REGEX = /^(([a-z]+)-){2}([0-9]{1,2})\.clerk\.accounts([a-z.]*)(dev|com)$/i;
function buildPublishableKey(frontendApi) {
  const keyPrefix = PUBLISHABLE_FRONTEND_API_DEV_REGEX.test(frontendApi) ? PUBLISHABLE_KEY_TEST_PREFIX : PUBLISHABLE_KEY_LIVE_PREFIX;
  return `${keyPrefix}${btoa(`${frontendApi}$`)}`;
}
function parsePublishableKey(key) {
  key = key || "";
  if (!isPublishableKey(key)) {
    return null;
  }
  const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
  let frontendApi = isomorphicAtob(key.split("_")[2]);
  if (!frontendApi.endsWith("$")) {
    return null;
  }
  frontendApi = frontendApi.slice(0, -1);
  return {
    instanceType,
    frontendApi
  };
}
function isPublishableKey(key) {
  key = key || "";
  const hasValidPrefix = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX);
  const hasValidFrontendApiPostfix = isomorphicAtob(key.split("_")[2] || "").endsWith("$");
  return hasValidPrefix && hasValidFrontendApiPostfix;
}
function isLegacyFrontendApiKey(key) {
  key = key || "";
  return key.startsWith("clerk.");
}
function createDevOrStagingUrlCache() {
  const DEV_OR_STAGING_SUFFIXES = [
    ".lcl.dev",
    ".stg.dev",
    ".lclstage.dev",
    ".stgstage.dev",
    ".dev.lclclerk.com",
    ".stg.lclclerk.com",
    ".accounts.lclclerk.com",
    "accountsstage.dev",
    "accounts.dev"
  ];
  const devOrStagingUrlCache = /* @__PURE__ */ new Map();
  return {
    isDevOrStagingUrl: (url) => {
      if (!url) {
        return false;
      }
      const hostname = typeof url === "string" ? url : url.hostname;
      let res = devOrStagingUrlCache.get(hostname);
      if (res === void 0) {
        res = DEV_OR_STAGING_SUFFIXES.some((s) => hostname.endsWith(s));
        devOrStagingUrlCache.set(hostname, res);
      }
      return res;
    }
  };
}
export {
  buildPublishableKey,
  createDevOrStagingUrlCache,
  isLegacyFrontendApiKey,
  isPublishableKey,
  parsePublishableKey
};
//# sourceMappingURL=keys.js.map