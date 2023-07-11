import "../chunk-UKSPFOP7.js";
const clerkLoaded = (isomorphicClerk) => {
  return new Promise((resolve) => {
    if (isomorphicClerk.loaded) {
      resolve();
    }
    isomorphicClerk.addOnLoaded(resolve);
  });
};
const createGetToken = (isomorphicClerk) => {
  return async (options) => {
    await clerkLoaded(isomorphicClerk);
    if (!isomorphicClerk.session) {
      return null;
    }
    return isomorphicClerk.session.getToken(options);
  };
};
const createSignOut = (isomorphicClerk) => {
  return async (...args) => {
    await clerkLoaded(isomorphicClerk);
    return isomorphicClerk.signOut(...args);
  };
};
export {
  createGetToken,
  createSignOut
};
//# sourceMappingURL=utils.js.map