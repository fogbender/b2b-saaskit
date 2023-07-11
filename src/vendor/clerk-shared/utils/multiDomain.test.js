import { handleValueOrFn } from "./multiDomain";
const url = new URL("https://example.com");
describe("handleValueOrFn(opts)", () => {
  it.each([
    [void 0, void 0],
    [true, true],
    [false, false],
    [() => true, true],
    [() => false, false],
    ["", ""],
    ["some-domain", "some-domain"],
    ["clerk.com", "clerk.com"],
    [(url2) => url2.host, "example.com"],
    [() => "some-other-domain", "some-other-domain"]
  ])(".handleValueOrFn(%s)", (key, expected) => {
    expect(handleValueOrFn(key, url)).toBe(expected);
  });
});
describe("handleValueOrFn(opts) with defaults", () => {
  it.each([
    [void 0, void 0, void 0],
    [void 0, true, true],
    [true, true, false],
    [void 0, false, false],
    [false, false, void 0],
    [void 0, "some-domain", "some-domain"]
  ])(".handleValueOrFn(%s)", (key, expected, defaultValue) => {
    expect(handleValueOrFn(key, url, defaultValue)).toBe(expected);
  });
});
//# sourceMappingURL=multiDomain.test.js.map