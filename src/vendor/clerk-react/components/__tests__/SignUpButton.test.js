import { render, screen, userEvent, waitFor } from "@clerk/shared/testUtils";
import React from "react";
import { SignUpButton } from "../SignUpButton";
const mockRedirectToSignUp = jest.fn();
const originalError = console.error;
const mockClerk = {
  redirectToSignUp: mockRedirectToSignUp
};
jest.mock("../withClerk", () => {
  return {
    withClerk: (Component) => (props) => {
      return /* @__PURE__ */ React.createElement(
        Component,
        {
          ...props,
          clerk: mockClerk
        }
      );
    }
  };
});
const url = "https://www.clerk.com";
describe("<SignUpButton/>", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  beforeEach(() => {
    mockRedirectToSignUp.mockReset();
  });
  it("calls clerk.redirectToSignUp when clicked", async () => {
    render(/* @__PURE__ */ React.createElement(SignUpButton, null));
    const btn = screen.getByText("Sign up");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignUp).toHaveBeenCalled();
    });
  });
  it("handles redirectUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignUpButton, { redirectUrl: url }));
    const btn = screen.getByText("Sign up");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignUp).toHaveBeenCalledWith({ redirectUrl: url });
    });
  });
  it("handles afterSignUpUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignUpButton, { afterSignUpUrl: url }));
    const btn = screen.getByText("Sign up");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignUp).toHaveBeenCalledWith({
        afterSignUpUrl: url
      });
    });
  });
  it("handles afterSignUpUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignUpButton, { afterSignUpUrl: url }));
    const btn = screen.getByText("Sign up");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignUp).toHaveBeenCalledWith({
        afterSignUpUrl: url
      });
    });
  });
  it("renders passed button and calls both click handlers", async () => {
    const handler = jest.fn();
    render(
      /* @__PURE__ */ React.createElement(SignUpButton, null, /* @__PURE__ */ React.createElement("button", { onClick: handler }, "custom button"))
    );
    const btn = screen.getByText("custom button");
    userEvent.click(btn);
    await waitFor(() => {
      expect(handler).toHaveBeenCalled();
      expect(mockRedirectToSignUp).toHaveBeenCalled();
    });
  });
  it("uses text passed as children", async () => {
    render(/* @__PURE__ */ React.createElement(SignUpButton, null, "text"));
    screen.getByText("text");
  });
  it("throws if multiple children provided", async () => {
    expect(() => {
      render(
        /* @__PURE__ */ React.createElement(SignUpButton, null, /* @__PURE__ */ React.createElement("button", null, "1"), /* @__PURE__ */ React.createElement("button", null, "2"))
      );
    }).toThrow();
  });
});
//# sourceMappingURL=SignUpButton.test.js.map