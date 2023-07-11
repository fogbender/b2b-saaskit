import globToRegexp from "glob-to-regexp";
const globs = {
  toRegexp: (pattern) => {
    try {
      return globToRegexp(pattern);
    } catch (e) {
      throw new Error(
        `Invalid pattern: ${pattern}.
Consult the documentation of glob-to-regexp here: https://www.npmjs.com/package/glob-to-regexp.
${e.message}`
      );
    }
  }
};
export {
  globs
};
//# sourceMappingURL=globs.js.map