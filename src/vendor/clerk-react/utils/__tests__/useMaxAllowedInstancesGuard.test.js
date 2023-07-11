import { render } from "@clerk/shared/testUtils";
import React from "react";
import { useMaxAllowedInstancesGuard, withMaxAllowedInstancesGuard } from "../useMaxAllowedInstancesGuard";
const originalError = console.error;
const ERR = "usedMoreThanOnceError";
describe("Max allowed instances Hook & Hoc", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  describe("useMaxAllowedInstancesGuard()", () => {
    const TestingComponent = () => {
      useMaxAllowedInstancesGuard("TestingComponent", ERR);
      return /* @__PURE__ */ React.createElement("div", null, "hello");
    };
    it("renders normally if not used more than N times", () => {
      expect(() => {
        render(
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(TestingComponent, null))
        );
      }).not.toThrowError(ERR);
    });
    it("throws an error if component is used more than N times", () => {
      expect(() => {
        render(
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(TestingComponent, null), /* @__PURE__ */ React.createElement(TestingComponent, null))
        );
      }).toThrowError(ERR);
    });
  });
  describe("withMaxAllowedInstancesGuard()", () => {
    const TestingComponentBase = () => {
      useMaxAllowedInstancesGuard("TestingComponent", ERR);
      return /* @__PURE__ */ React.createElement("div", null, "hello");
    };
    const TestingComp = withMaxAllowedInstancesGuard(TestingComponentBase, "TestingComp", ERR);
    it("renders normally if not used more than N times", () => {
      expect(() => {
        render(
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(TestingComp, null))
        );
      }).not.toThrowError(ERR);
    });
    it("throws an error if component is used more than N times", () => {
      expect(() => {
        render(
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(TestingComp, null), /* @__PURE__ */ React.createElement(TestingComp, null))
        );
      }).toThrowError(ERR);
    });
  });
});
//# sourceMappingURL=useMaxAllowedInstancesGuard.test.js.map