const IP_V4_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
function isIPV4Address(str) {
  return IP_V4_ADDRESS_REGEX.test(str || "");
}
function titleize(str) {
  const s = str || "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function snakeToCamel(str) {
  return str ? str.replace(/([-_][a-z])/g, (match) => match.toUpperCase().replace(/-|_/, "")) : "";
}
function camelToSnake(str) {
  return str ? str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) : "";
}
export {
  camelToSnake,
  isIPV4Address,
  snakeToCamel,
  titleize
};
//# sourceMappingURL=string.js.map