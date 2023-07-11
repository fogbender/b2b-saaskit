function isValidProxyUrl(key) {
  if (!key) {
    return true;
  }
  return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
  return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
  return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
  if (!url) {
    return "";
  }
  return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
function getRequestUrl({ request, relativePath }) {
  const { headers, url: initialUrl } = request;
  const url = new URL(initialUrl);
  const host = headers.get("X-Forwarded-Host") ?? headers.get("host") ?? headers["host"] ?? url.host;
  let protocol = (headers.get("X-Forwarded-Proto") ?? headers["X-Forwarded-Proto"])?.split(",")[0] ?? url.protocol;
  protocol = protocol.replace(/[:/]/, "");
  return new URL(relativePath || url.pathname, `${protocol}://${host}`);
}
export {
  getRequestUrl,
  isHttpOrHttps,
  isProxyUrlRelative,
  isValidProxyUrl,
  proxyUrlToAbsoluteURL
};
//# sourceMappingURL=proxy.js.map