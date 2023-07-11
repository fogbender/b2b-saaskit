import "../chunk-UKSPFOP7.js";
import { addClerkPrefix, isValidProxyUrl, loadScript, parsePublishableKey, proxyUrlToAbsoluteURL } from "@clerk/shared";
import { errorThrower } from "./errorThrower";
import { isDevOrStagingUrl } from "./isDevOrStageUrl";
const FAILED_TO_LOAD_ERROR = "Clerk: Failed to load Clerk";
const loadClerkJsScript = async (opts) => {
  const { frontendApi, publishableKey } = opts;
  if (!publishableKey && !frontendApi) {
    errorThrower.throwMissingPublishableKeyError();
  }
  return loadScript(clerkJsScriptUrl(opts), {
    async: true,
    crossOrigin: "anonymous",
    beforeLoad: applyClerkJsScriptAttributes(opts)
  }).catch(() => {
    throw new Error(FAILED_TO_LOAD_ERROR);
  });
};
const clerkJsScriptUrl = (opts) => {
  const { clerkJSUrl, clerkJSVariant, clerkJSVersion, proxyUrl, domain, publishableKey, frontendApi } = opts;
  if (clerkJSUrl) {
    return clerkJSUrl;
  }
  let scriptHost = "";
  if (!!proxyUrl && isValidProxyUrl(proxyUrl)) {
    scriptHost = proxyUrlToAbsoluteURL(proxyUrl).replace(/http(s)?:\/\//, "");
  } else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || frontendApi || "")) {
    scriptHost = addClerkPrefix(domain);
  } else {
    scriptHost = parsePublishableKey(publishableKey)?.frontendApi || frontendApi || "";
  }
  const variant = clerkJSVariant ? `${clerkJSVariant.replace(/\.+$/, "")}.` : "";
  const version = clerkJSVersion || getPrereleaseTag("4.22.0") || getMajorVersion("4.22.0");
  return `https://${scriptHost}/npm/@clerk/clerk-js@${version}/dist/clerk.${variant}browser.js`;
};
const applyClerkJsScriptAttributes = (options) => (script) => {
  const { publishableKey, frontendApi, proxyUrl, domain } = options;
  if (publishableKey) {
    script.setAttribute("data-clerk-publishable-key", publishableKey);
  } else if (frontendApi) {
    script.setAttribute("data-clerk-frontend-api", frontendApi);
  }
  if (proxyUrl) {
    script.setAttribute("data-clerk-proxy-url", proxyUrl);
  }
  if (domain) {
    script.setAttribute("data-clerk-domain", domain);
  }
};
const getPrereleaseTag = (packageVersion) => packageVersion.match(/-(.*)\./)?.[1];
const getMajorVersion = (packageVersion) => packageVersion.split(".")[0];
export {
  loadClerkJsScript
};
//# sourceMappingURL=loadClerkJsScript.js.map