import "../chunk-UKSPFOP7.js";
import React from "react";
import { assertWrappedByClerkProvider } from "./assertHelpers";
const StructureContextStates = Object.freeze({
  noGuarantees: Object.freeze({
    guaranteedLoaded: false
  }),
  guaranteedLoaded: Object.freeze({
    guaranteedLoaded: true
  })
});
const StructureContext = React.createContext(void 0);
StructureContext.displayName = "StructureContext";
const useStructureContext = () => {
  const structureCtx = React.useContext(StructureContext);
  assertWrappedByClerkProvider(structureCtx);
  return structureCtx;
};
const LoadedGuarantee = ({ children }) => {
  const structure = useStructureContext();
  if (structure.guaranteedLoaded) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return /* @__PURE__ */ React.createElement(StructureContext.Provider, { value: StructureContextStates.guaranteedLoaded }, children);
};
export {
  LoadedGuarantee,
  StructureContext,
  StructureContextStates
};
//# sourceMappingURL=StructureContext.js.map