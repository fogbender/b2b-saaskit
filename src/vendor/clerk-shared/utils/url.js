function parseSearchParams(queryString = "") {
  if (queryString.startsWith("?")) {
    queryString = queryString.slice(1);
  }
  return new URLSearchParams(queryString);
}
function stripScheme(url = "") {
  return (url || "").replace(/^.+:\/\//, "");
}
function addClerkPrefix(str) {
  if (!str) {
    return "";
  }
  let regex;
  if (str.match(/^(clerk\.)+\w*$/)) {
    regex = /(clerk\.)*(?=clerk\.)/;
  } else if (str.match(/\.clerk.accounts/)) {
    return str;
  } else {
    regex = /^(clerk\.)*/gi;
  }
  const stripped = str.replace(regex, "");
  return `clerk.${stripped}`;
}
export {
  addClerkPrefix,
  parseSearchParams,
  stripScheme
};
//# sourceMappingURL=url.js.map