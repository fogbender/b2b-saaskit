import { render, screen, userEvent, waitFor } from "@clerk/shared/testUtils";
import React from "react";
import { SignInButton } from "../SignInButton";
const mockRedirectToSignIn = jest.fn();
const originalError = console.error;
const mockClerk = {
  redirectToSignIn: mockRedirectToSignIn
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
describe("<SignInButton/>", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  beforeEach(() => {
    mockRedirectToSignIn.mockReset();
  });
  it("calls clerk.redirectToSignIn when clicked", async () => {
    render(/* @__PURE__ */ React.createElement(SignInButton, null));
    const btn = screen.getByText("Sign in");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignIn).toHaveBeenCalled();
    });
  });
  it("handles redirectUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignInButton, { redirectUrl: url }));
    const btn = screen.getByText("Sign in");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignIn).toHaveBeenCalledWith({ redirectUrl: url });
    });
  });
  it("handles afterSignInUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignInButton, { afterSignInUrl: url }));
    const btn = screen.getByText("Sign in");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignIn).toHaveBeenCalledWith({
        afterSignInUrl: url
      });
    });
  });
  it("handles afterSignUpUrl prop", async () => {
    render(/* @__PURE__ */ React.createElement(SignInButton, { afterSignUpUrl: url }));
    const btn = screen.getByText("Sign in");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockRedirectToSignIn).toHaveBeenCalledWith({
        afterSignUpUrl: url
      });
    });
  });
  it("renders passed button and calls both click handlers", async () => {
    const handler = jest.fn();
    render(
      /* @__PURE__ */ React.createElement(SignInButton, null, /* @__PURE__ */ React.createElement("button", { onClick: handler }, "custom button"))
    );
    const btn = screen.getByText("custom button");
    userEvent.click(btn);
    await waitFor(() => {
      expect(handler).toHaveBeenCalled();
      expect(mockRedirectToSignIn).toHaveBeenCalled();
    });
  });
  it("uses text passed as children", async () => {
    render(/* @__PURE__ */ React.createElement(SignInButton, null, "text"));
    screen.getByText("text");
  });
  it("throws if multiple children provided", async () => {
    expect(() => {
      render(
        /* @__PURE__ */ React.createElement(SignInButton, null, /* @__PURE__ */ React.createElement("button", null, "1"), /* @__PURE__ */ React.createElement("button", null, "2"))
      );
    }).toThrow();
  });
});
//# sourceMappingURL=SignInButton.test.js.map