import { deDe, enUS, esES, frFR, itIT, jaJP, ptBR, ruRU, svSE, trTR, csCZ, koKR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import { expectTypeOf } from "expect-type";
describe("ClerkProvider", () => {
  describe("Type tests", () => {
    describe("publishableKey and frontendApi", () => {
      it("expects a publishableKey and children as the minimum accepted case", () => {
        expectTypeOf({ publishableKey: "test", children: "" }).toMatchTypeOf();
      });
      it("publishable key is replaceable with frontendApi", () => {
        expectTypeOf({ frontendApi: "test", children: "" }).toMatchTypeOf();
      });
      it("errors if no publishableKey or frontendApi", () => {
        expectTypeOf({ children: "" }).not.toMatchTypeOf();
      });
      it("errors if both publishableKey and frontendApi are provided", () => {
        expectTypeOf({ publishableKey: "test", frontendApi: "test" }).not.toMatchTypeOf();
      });
    });
  });
  describe("Multi domain", () => {
    const defaultProps = { publishableKey: "test", children: "" };
    it("proxyUrl (primary app)", () => {
      expectTypeOf({ ...defaultProps, proxyUrl: "test" }).toMatchTypeOf();
    });
    it("proxyUrl + isSatellite (satellite app)", () => {
      expectTypeOf({ ...defaultProps, proxyUrl: "test", isSatellite: true }).toMatchTypeOf();
    });
    it("domain + isSatellite (satellite app)", () => {
      expectTypeOf({ ...defaultProps, domain: "test", isSatellite: true }).toMatchTypeOf();
    });
    it("only domain is not allowed", () => {
      expectTypeOf({ ...defaultProps, domain: "test" }).not.toMatchTypeOf();
    });
    it("only isSatellite is not allowed", () => {
      expectTypeOf({ ...defaultProps, isSatellite: true }).not.toMatchTypeOf();
    });
    it("proxyUrl + domain is not allowed", () => {
      expectTypeOf({ ...defaultProps, proxyUrl: "test", domain: "test" }).not.toMatchTypeOf();
    });
    it("proxyUrl + domain + isSatellite is not allowed", () => {
      expectTypeOf({
        ...defaultProps,
        proxyUrl: "test",
        domain: "test",
        isSatellite: true
      }).not.toMatchTypeOf();
    });
  });
  describe("clerkJSVariant", () => {
    const defaultProps = { publishableKey: "test", children: "" };
    it("is either headless or empty", () => {
      expectTypeOf({ ...defaultProps, clerkJSVariant: "headless" }).toMatchTypeOf();
      expectTypeOf({ ...defaultProps, clerkJSVariant: "" }).toMatchTypeOf();
      expectTypeOf({ ...defaultProps, clerkJSVariant: void 0 }).toMatchTypeOf();
      expectTypeOf({ ...defaultProps, clerkJSVariant: "test" }).not.toMatchTypeOf();
    });
  });
  describe("appearance", () => {
    const defaultProps = { publishableKey: "test", children: "" };
    it("exists as a prop", () => {
      expectTypeOf({ ...defaultProps, appearance: {} }).toMatchTypeOf();
    });
    it("includes variables, elements, layout baseTheme", () => {
      expectTypeOf({
        ...defaultProps,
        appearance: { elements: {}, variables: {}, layout: {}, baseTheme: dark }
      }).toMatchTypeOf();
    });
    it("errors if a non existent key is provided", () => {
      expectTypeOf({
        ...defaultProps,
        appearance: { variables: { nonExistentKey: "" } }
      }).not.toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        appearance: { layout: { nonExistentKey: "" } }
      }).not.toMatchTypeOf();
    });
  });
  describe("localization", () => {
    const defaultProps = { publishableKey: "test", children: "" };
    it("exists as a prop", () => {
      expectTypeOf({ ...defaultProps, localization: {} }).toMatchTypeOf();
    });
    it("errors if a non existent key is provided", () => {
      expectTypeOf({
        ...defaultProps,
        localization: { a: "test" }
      }).not.toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: { signUp: { start: "test" } }
      }).not.toMatchTypeOf();
    });
    it("works with all our prebuilt localizations", () => {
      expectTypeOf({
        ...defaultProps,
        localization: deDe
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: frFR
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: enUS
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: esES
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: itIT
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: ptBR
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: ruRU
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: svSE
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: trTR
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: jaJP
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: jaJP
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: csCZ
      }).toMatchTypeOf();
      expectTypeOf({
        ...defaultProps,
        localization: koKR
      }).toMatchTypeOf();
    });
    it("is able to receive multiple localizations", () => {
      expectTypeOf({
        ...defaultProps,
        localization: { ...frFR, ...deDe }
      }).toMatchTypeOf();
    });
  });
  describe("children", () => {
    it("errors if no children", () => {
      expectTypeOf({ publishableKey: "test" }).not.toMatchTypeOf();
    });
  });
});
//# sourceMappingURL=ClerkProvider.test.js.map