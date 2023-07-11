import {
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-UKSPFOP7.js";
var _loaded, _domain, _proxyUrl, _instance;
import { handleValueOrFn, inClientSide } from "@clerk/shared";
import { unsupportedNonBrowserDomainOrProxyUrlFunction } from "./errors";
import { isConstructor, loadClerkJsScript } from "./utils";
const _IsomorphicClerk = class {
  constructor(options) {
    this.clerkjs = null;
    this.preopenSignIn = null;
    this.preopenSignUp = null;
    this.preopenUserProfile = null;
    this.preopenOrganizationProfile = null;
    this.preopenCreateOrganization = null;
    this.premountSignInNodes = /* @__PURE__ */ new Map();
    this.premountSignUpNodes = /* @__PURE__ */ new Map();
    this.premountUserProfileNodes = /* @__PURE__ */ new Map();
    this.premountUserButtonNodes = /* @__PURE__ */ new Map();
    this.premountOrganizationProfileNodes = /* @__PURE__ */ new Map();
    this.premountCreateOrganizationNodes = /* @__PURE__ */ new Map();
    this.premountOrganizationSwitcherNodes = /* @__PURE__ */ new Map();
    this.premountMethodCalls = /* @__PURE__ */ new Map();
    this.loadedListeners = [];
    __privateAdd(this, _loaded, false);
    __privateAdd(this, _domain, void 0);
    __privateAdd(this, _proxyUrl, void 0);
    this.addOnLoaded = (cb) => {
      this.loadedListeners.push(cb);
    };
    this.emitLoaded = () => {
      this.loadedListeners.forEach((cb) => cb());
      this.loadedListeners = [];
    };
    this.hydrateClerkJS = (clerkjs) => {
      if (!clerkjs) {
        throw new Error("Failed to hydrate latest Clerk JS");
      }
      this.clerkjs = clerkjs;
      this.premountMethodCalls.forEach((cb) => cb());
      if (this.preopenSignIn !== null) {
        clerkjs.openSignIn(this.preopenSignIn);
      }
      if (this.preopenSignUp !== null) {
        clerkjs.openSignUp(this.preopenSignUp);
      }
      if (this.preopenUserProfile !== null) {
        clerkjs.openUserProfile(this.preopenUserProfile);
      }
      if (this.preopenOrganizationProfile !== null) {
        clerkjs.openOrganizationProfile(this.preopenOrganizationProfile);
      }
      if (this.preopenCreateOrganization !== null) {
        clerkjs.openCreateOrganization(this.preopenCreateOrganization);
      }
      this.premountSignInNodes.forEach((props, node) => {
        clerkjs.mountSignIn(node, props);
      });
      this.premountSignUpNodes.forEach((props, node) => {
        clerkjs.mountSignUp(node, props);
      });
      this.premountUserProfileNodes.forEach((props, node) => {
        clerkjs.mountUserProfile(node, props);
      });
      this.premountUserButtonNodes.forEach((props, node) => {
        clerkjs.mountUserButton(node, props);
      });
      __privateSet(this, _loaded, true);
      this.emitLoaded();
      return this.clerkjs;
    };
    this.__unstable__updateProps = (props) => {
      if (this.clerkjs && "__unstable__updateProps" in this.clerkjs) {
        this.clerkjs.__unstable__updateProps(props);
      } else {
        return void 0;
      }
    };
    /**
     * `setActive` can be used to set the active session and/or organization.
     * It will eventually replace `setSession`.
     *
     * @experimental
     */
    this.setActive = ({ session, organization, beforeEmit }) => {
      if (this.clerkjs) {
        return this.clerkjs.setActive({ session, organization, beforeEmit });
      } else {
        return Promise.reject();
      }
    };
    this.setSession = (session, beforeEmit) => {
      return this.setActive({ session, beforeEmit });
    };
    this.openSignIn = (props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.openSignIn(props);
      } else {
        this.preopenSignIn = props;
      }
    };
    this.closeSignIn = () => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.closeSignIn();
      } else {
        this.preopenSignIn = null;
      }
    };
    this.openUserProfile = (props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.openUserProfile(props);
      } else {
        this.preopenUserProfile = props;
      }
    };
    this.closeUserProfile = () => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.closeUserProfile();
      } else {
        this.preopenUserProfile = null;
      }
    };
    this.openOrganizationProfile = (props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.openOrganizationProfile(props);
      } else {
        this.preopenOrganizationProfile = props;
      }
    };
    this.closeOrganizationProfile = () => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.closeOrganizationProfile();
      } else {
        this.preopenOrganizationProfile = null;
      }
    };
    this.openCreateOrganization = (props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.openCreateOrganization(props);
      } else {
        this.preopenCreateOrganization = props;
      }
    };
    this.closeCreateOrganization = () => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.closeCreateOrganization();
      } else {
        this.preopenCreateOrganization = null;
      }
    };
    this.openSignUp = (props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.openSignUp(props);
      } else {
        this.preopenSignUp = props;
      }
    };
    this.closeSignUp = () => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.closeSignUp();
      } else {
        this.preopenSignUp = null;
      }
    };
    this.mountSignIn = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountSignIn(node, props);
      } else {
        this.premountSignInNodes.set(node, props);
      }
    };
    this.unmountSignIn = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountSignIn(node);
      } else {
        this.premountSignInNodes.delete(node);
      }
    };
    this.mountSignUp = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountSignUp(node, props);
      } else {
        this.premountSignUpNodes.set(node, props);
      }
    };
    this.unmountSignUp = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountSignUp(node);
      } else {
        this.premountSignUpNodes.delete(node);
      }
    };
    this.mountUserProfile = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountUserProfile(node, props);
      } else {
        this.premountUserProfileNodes.set(node, props);
      }
    };
    this.unmountUserProfile = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountUserProfile(node);
      } else {
        this.premountUserProfileNodes.delete(node);
      }
    };
    this.mountOrganizationProfile = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountOrganizationProfile(node, props);
      } else {
        this.premountOrganizationProfileNodes.set(node, props);
      }
    };
    this.unmountOrganizationProfile = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountOrganizationProfile(node);
      } else {
        this.premountOrganizationProfileNodes.delete(node);
      }
    };
    this.mountCreateOrganization = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountCreateOrganization(node, props);
      } else {
        this.premountCreateOrganizationNodes.set(node, props);
      }
    };
    this.unmountCreateOrganization = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountCreateOrganization(node);
      } else {
        this.premountCreateOrganizationNodes.delete(node);
      }
    };
    this.mountOrganizationSwitcher = (node, props) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountOrganizationSwitcher(node, props);
      } else {
        this.premountOrganizationSwitcherNodes.set(node, props);
      }
    };
    this.unmountOrganizationSwitcher = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountOrganizationSwitcher(node);
      } else {
        this.premountOrganizationSwitcherNodes.delete(node);
      }
    };
    this.mountUserButton = (node, userButtonProps) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.mountUserButton(node, userButtonProps);
      } else {
        this.premountUserButtonNodes.set(node, userButtonProps);
      }
    };
    this.unmountUserButton = (node) => {
      if (this.clerkjs && __privateGet(this, _loaded)) {
        this.clerkjs.unmountUserButton(node);
      } else {
        this.premountUserButtonNodes.delete(node);
      }
    };
    this.addListener = (listener) => {
      const callback = () => this.clerkjs?.addListener(listener);
      if (this.clerkjs) {
        return callback();
      } else {
        this.premountMethodCalls.set("addListener", callback);
        return () => this.premountMethodCalls.delete("addListener");
      }
    };
    this.navigate = (to) => {
      const callback = () => this.clerkjs?.navigate(to);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        void callback();
      } else {
        this.premountMethodCalls.set("navigate", callback);
      }
    };
    this.redirectWithAuth = (...args) => {
      const callback = () => this.clerkjs?.redirectWithAuth(...args);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        void callback();
      } else {
        this.premountMethodCalls.set("redirectWithAuth", callback);
      }
    };
    this.redirectToSignIn = (opts) => {
      const callback = () => this.clerkjs?.redirectToSignIn(opts);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        void callback();
      } else {
        this.premountMethodCalls.set("redirectToSignIn", callback);
      }
    };
    this.redirectToSignUp = (opts) => {
      const callback = () => this.clerkjs?.redirectToSignUp(opts);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        void callback();
      } else {
        this.premountMethodCalls.set("redirectToSignUp", callback);
      }
    };
    this.redirectToUserProfile = () => {
      const callback = () => this.clerkjs?.redirectToUserProfile();
      if (this.clerkjs && __privateGet(this, _loaded)) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToUserProfile", callback);
      }
    };
    this.redirectToHome = () => {
      const callback = () => this.clerkjs?.redirectToHome();
      if (this.clerkjs && __privateGet(this, _loaded)) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToHome", callback);
      }
    };
    this.redirectToOrganizationProfile = () => {
      const callback = () => this.clerkjs?.redirectToOrganizationProfile();
      if (this.clerkjs && __privateGet(this, _loaded)) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToOrganizationProfile", callback);
      }
    };
    this.redirectToCreateOrganization = () => {
      const callback = () => this.clerkjs?.redirectToCreateOrganization();
      if (this.clerkjs && __privateGet(this, _loaded)) {
        callback();
      } else {
        this.premountMethodCalls.set("redirectToCreateOrganization", callback);
      }
    };
    this.handleRedirectCallback = (params) => {
      const callback = () => this.clerkjs?.handleRedirectCallback(params);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        void callback()?.catch(() => {
        });
      } else {
        this.premountMethodCalls.set("handleRedirectCallback", callback);
      }
    };
    this.handleMagicLinkVerification = async (params) => {
      const callback = () => this.clerkjs?.handleMagicLinkVerification(params);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("handleMagicLinkVerification", callback);
      }
    };
    this.authenticateWithMetamask = async (params) => {
      const callback = () => this.clerkjs?.authenticateWithMetamask(params);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("authenticateWithMetamask", callback);
      }
    };
    this.createOrganization = async (params) => {
      const callback = () => this.clerkjs?.createOrganization(params);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("createOrganization", callback);
      }
    };
    this.getOrganizationMemberships = async () => {
      const callback = () => this.clerkjs?.getOrganizationMemberships();
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("getOrganizationMemberships", callback);
      }
    };
    this.getOrganization = async (organizationId) => {
      const callback = () => this.clerkjs?.getOrganization(organizationId);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("getOrganization", callback);
      }
    };
    this.signOut = async (signOutCallbackOrOptions, options) => {
      const callback = () => this.clerkjs?.signOut(signOutCallbackOrOptions, options);
      if (this.clerkjs && __privateGet(this, _loaded)) {
        return callback();
      } else {
        this.premountMethodCalls.set("signOut", callback);
      }
    };
    const { Clerk = null, frontendApi, publishableKey } = options || {};
    this.frontendApi = frontendApi;
    this.publishableKey = publishableKey;
    __privateSet(this, _proxyUrl, options?.proxyUrl);
    __privateSet(this, _domain, options?.domain);
    this.options = options;
    this.Clerk = Clerk;
    this.mode = inClientSide() ? "browser" : "server";
    void this.loadClerkJS();
  }
  get loaded() {
    return __privateGet(this, _loaded);
  }
  static getOrCreateInstance(options) {
    if (!inClientSide() || !__privateGet(this, _instance)) {
      __privateSet(this, _instance, new _IsomorphicClerk(options));
    }
    return __privateGet(this, _instance);
  }
  get domain() {
    if (typeof window !== "undefined" && window.location) {
      return handleValueOrFn(__privateGet(this, _domain), new URL(window.location.href), "");
    }
    if (typeof __privateGet(this, _domain) === "function") {
      throw new Error(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return __privateGet(this, _domain) || "";
  }
  get proxyUrl() {
    if (typeof window !== "undefined" && window.location) {
      return handleValueOrFn(__privateGet(this, _proxyUrl), new URL(window.location.href), "");
    }
    if (typeof __privateGet(this, _proxyUrl) === "function") {
      throw new Error(unsupportedNonBrowserDomainOrProxyUrlFunction);
    }
    return __privateGet(this, _proxyUrl) || "";
  }
  async loadClerkJS() {
    if (this.mode !== "browser" || __privateGet(this, _loaded)) {
      return;
    }
    if (typeof window !== "undefined") {
      window.__clerk_frontend_api = this.frontendApi;
      window.__clerk_publishable_key = this.publishableKey;
      window.__clerk_proxy_url = this.proxyUrl;
      window.__clerk_domain = this.domain;
    }
    try {
      if (this.Clerk) {
        let c;
        if (isConstructor(this.Clerk)) {
          c = new this.Clerk(this.publishableKey || this.frontendApi || "", {
            proxyUrl: this.proxyUrl,
            domain: this.domain
          });
          await c.load(this.options);
        } else {
          c = this.Clerk;
          if (!c.isReady()) {
            await c.load(this.options);
          }
        }
        global.Clerk = c;
      } else {
        if (!global.Clerk) {
          await loadClerkJsScript({
            ...this.options,
            frontendApi: this.frontendApi,
            publishableKey: this.publishableKey,
            proxyUrl: this.proxyUrl,
            domain: this.domain
          });
        }
        if (!global.Clerk) {
          throw new Error("Failed to download latest ClerkJS. Contact support@clerk.com.");
        }
        await global.Clerk.load(this.options);
      }
      if (global.Clerk?.loaded || global.Clerk?.isReady()) {
        return this.hydrateClerkJS(global.Clerk);
      }
      return;
    } catch (err) {
      const error = err;
      if (process.env.NODE_ENV === "production") {
        console.error(error.stack || error.message || error);
      } else {
        throw err;
      }
      return;
    }
  }
  get version() {
    return this.clerkjs?.version;
  }
  get client() {
    if (this.clerkjs) {
      return this.clerkjs.client;
    } else {
      return void 0;
    }
  }
  get session() {
    if (this.clerkjs) {
      return this.clerkjs.session;
    } else {
      return void 0;
    }
  }
  get user() {
    if (this.clerkjs) {
      return this.clerkjs.user;
    } else {
      return void 0;
    }
  }
  get organization() {
    if (this.clerkjs) {
      return this.clerkjs.organization;
    } else {
      return void 0;
    }
  }
  get __unstable__environment() {
    if (this.clerkjs) {
      return this.clerkjs.__unstable__environment;
    } else {
      return void 0;
    }
  }
  __unstable__setEnvironment(...args) {
    if (this.clerkjs && "__unstable__setEnvironment" in this.clerkjs) {
      this.clerkjs.__unstable__setEnvironment(args);
    } else {
      return void 0;
    }
  }
};
let IsomorphicClerk = _IsomorphicClerk;
_loaded = new WeakMap();
_domain = new WeakMap();
_proxyUrl = new WeakMap();
_instance = new WeakMap();
__privateAdd(IsomorphicClerk, _instance, void 0);
export {
  IsomorphicClerk as default
};
//# sourceMappingURL=isomorphicClerk.js.map