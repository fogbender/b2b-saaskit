const MimeTypeToExtensionMap = Object.freeze({
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico"
});
const extension = (mimeType) => {
  return MimeTypeToExtensionMap[mimeType];
};
export {
  extension
};
//# sourceMappingURL=mimeTypeExtensions.js.map