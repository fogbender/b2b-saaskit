import "./chunk-UKSPFOP7.js";
import {
  isMagicLinkError,
  MagicLinkErrorCode,
  isClerkAPIResponseError,
  isKnownError,
  isMetamaskError
} from "@clerk/shared";
const noFrontendApiError = "Clerk: You must add the frontendApi prop to your <ClerkProvider>";
const noClerkProviderError = "Clerk: You must wrap your application in a <ClerkProvider> component.";
const noGuaranteedLoadedError = (hookName) => `Clerk: You're calling ${hookName} before there's a guarantee the client has been loaded. Call ${hookName} from a child of <SignedIn>, <SignedOut>, or <ClerkLoaded>, or use the withClerk() HOC.`;
const noGuaranteedUserError = (hookName) => `Clerk: You're calling ${hookName} before there's a guarantee there's an active user. Call ${hookName} from a child of <SignedIn> or use the withUser() HOC.`;
const multipleClerkProvidersError = "Clerk: You've added multiple <ClerkProvider> components in your React component tree. Wrap your components in a single <ClerkProvider>.";
const hocChildrenNotAFunctionError = "Clerk: Child of WithClerk must be a function.";
const multipleChildrenInButtonComponent = (name) => `Clerk: You've passed multiple children components to <${name}/>. You can only pass a single child component or text.`;
const invalidStateError = "Invalid state. Feel free to submit a bug or reach out to support here: https://clerk.com/support";
const unsupportedNonBrowserDomainOrProxyUrlFunction = "Unsupported usage of domain or proxyUrl. The usage of domain or proxyUrl as function is not supported in non-browser environments.";
export {
  MagicLinkErrorCode,
  hocChildrenNotAFunctionError,
  invalidStateError,
  isClerkAPIResponseError,
  isKnownError,
  isMagicLinkError,
  isMetamaskError,
  multipleChildrenInButtonComponent,
  multipleClerkProvidersError,
  noClerkProviderError,
  noFrontendApiError,
  noGuaranteedLoadedError,
  noGuaranteedUserError,
  unsupportedNonBrowserDomainOrProxyUrlFunction
};
//# sourceMappingURL=errors.js.map