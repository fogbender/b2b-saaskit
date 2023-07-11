const IS_HEX_COLOR_REGEX = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;
const IS_RGB_COLOR_REGEX = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i;
const IS_RGBA_COLOR_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+(\.\d+)?)\)$/i;
const IS_HSL_COLOR_REGEX = /^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/i;
const IS_HSLA_COLOR_REGEX = /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(,\s*\d+(\.\d+)?)*\)$/i;
const isValidHexString = (s) => {
  return !!s.match(IS_HEX_COLOR_REGEX);
};
const isValidRgbaString = (s) => {
  return !!(s.match(IS_RGB_COLOR_REGEX) || s.match(IS_RGBA_COLOR_REGEX));
};
const isValidHslaString = (s) => {
  return !!s.match(IS_HSL_COLOR_REGEX) || !!s.match(IS_HSLA_COLOR_REGEX);
};
const isRGBColor = (c) => {
  return typeof c !== "string" && "r" in c;
};
const isHSLColor = (c) => {
  return typeof c !== "string" && "h" in c;
};
const isTransparent = (c) => {
  return c === "transparent";
};
const hasAlpha = (color) => {
  return typeof color !== "string" && color.a != void 0 && color.a < 1;
};
export {
  hasAlpha,
  isHSLColor,
  isRGBColor,
  isTransparent,
  isValidHexString,
  isValidHslaString,
  isValidRgbaString
};
//# sourceMappingURL=predicates.js.map