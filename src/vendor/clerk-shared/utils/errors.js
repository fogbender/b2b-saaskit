function isUnauthorizedError(e) {
  const status = e?.status;
  const code = e?.errors?.[0]?.code;
  return code === "authentication_invalid" && status === 401;
}
function isNetworkError(e) {
  const message = (`${e.message}${e.name}` || "").toLowerCase().replace(/\s+/g, "");
  return message.includes("networkerror");
}
export {
  isNetworkError,
  isUnauthorizedError
};
//# sourceMappingURL=errors.js.map