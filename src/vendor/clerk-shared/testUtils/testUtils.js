import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { noop } from "../utils";
const customRender = (ui, options) => {
  return render(ui, options);
};
export * from "@testing-library/react";
import { default as default2 } from "@testing-library/user-event";
export {
  noop,
  customRender as render,
  default2 as userEvent
};
//# sourceMappingURL=testUtils.js.map