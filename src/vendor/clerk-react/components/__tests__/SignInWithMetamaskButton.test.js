import { render, screen, userEvent, waitFor } from "@clerk/shared/testUtils";
import React from "react";
import { SignInWithMetamaskButton } from "../SignInWithMetamaskButton";
const mockAuthenticatewithMetamask = jest.fn();
const originalError = console.error;
const mockClerk = {
  authenticateWithMetamask: mockAuthenticatewithMetamask
};
jest.mock("../withClerk", () => {
  return {
    withClerk: (Component) => (props) => /* @__PURE__ */ React.createElement(
      Component,
      {
        ...props,
        clerk: mockClerk
      }
    )
  };
});
describe("<SignInWithMetamaskButton/>", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  beforeEach(() => {
    mockAuthenticatewithMetamask.mockReset();
  });
  it("calls clerk.authenticateWithMetamask when clicked", async () => {
    render(/* @__PURE__ */ React.createElement(SignInWithMetamaskButton, null));
    const btn = screen.getByText("Sign in with Metamask");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockAuthenticatewithMetamask).toHaveBeenCalled();
    });
  });
  it("uses text passed as children", async () => {
    render(/* @__PURE__ */ React.createElement(SignInWithMetamaskButton, null, "text"));
    screen.getByText("text");
  });
  it("throws if multiple children provided", async () => {
    expect(() => {
      render(
        /* @__PURE__ */ React.createElement(SignInWithMetamaskButton, null, /* @__PURE__ */ React.createElement("button", null, "1"), /* @__PURE__ */ React.createElement("button", null, "2"))
      );
    }).toThrow();
  });
});
//# sourceMappingURL=SignInWithMetamaskButton.test.js.map