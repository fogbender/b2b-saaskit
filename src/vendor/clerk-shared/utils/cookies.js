import Cookies from "js-cookie";
function createCookieHandler(cookieName) {
  return {
    get() {
      return Cookies.get(cookieName);
    },
    /**
     * Setting a cookie will use some defaults such as path being set to "/".
     */
    set(newValue, options = {}) {
      return Cookies.set(cookieName, newValue, options);
    },
    /**
     * On removing a cookie, you have to pass the exact same path/domain attributes used to set it initially
     * @see https://github.com/js-cookie/js-cookie#basic-usage
     */
    remove(locationAttributes) {
      Cookies.remove(cookieName, locationAttributes);
    }
  };
}
export {
  createCookieHandler
};
//# sourceMappingURL=cookies.js.map