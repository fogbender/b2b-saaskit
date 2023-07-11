import { render, screen, userEvent, waitFor } from "@clerk/shared/testUtils";
import React from "react";
import { SignOutButton } from "../SignOutButton";
const mockSignOut = jest.fn();
const originalError = console.error;
const mockClerk = {
  signOut: mockSignOut
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
describe("<SignOutButton />", () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
  beforeEach(() => {
    mockSignOut.mockReset();
  });
  it("calls clerk.signOutOne when clicked", async () => {
    render(/* @__PURE__ */ React.createElement(SignOutButton, null));
    const btn = screen.getByText("Sign out");
    userEvent.click(btn);
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
  it("uses text passed as children", async () => {
    render(/* @__PURE__ */ React.createElement(SignOutButton, null, "text"));
    screen.getByText("text");
  });
  it("throws if multiple children provided", async () => {
    expect(() => {
      render(
        /* @__PURE__ */ React.createElement(SignOutButton, null, /* @__PURE__ */ React.createElement("button", null, "1"), /* @__PURE__ */ React.createElement("button", null, "2"))
      );
    }).toThrow();
  });
});
//# sourceMappingURL=SignOutButton.test.js.map