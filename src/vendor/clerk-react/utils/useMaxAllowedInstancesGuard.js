import "../chunk-UKSPFOP7.js";
import React from "react";
const counts = /* @__PURE__ */ new Map();
function useMaxAllowedInstancesGuard(name, error, maxCount = 1) {
  React.useEffect(() => {
    const count = counts.get(name) || 0;
    if (count == maxCount) {
      throw new Error(error);
    }
    counts.set(name, count + 1);
    return () => {
      counts.set(name, (counts.get(name) || 1) - 1);
    };
  }, []);
}
function withMaxAllowedInstancesGuard(WrappedComponent, name, error) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || name || "Component";
  const Hoc = (props) => {
    useMaxAllowedInstancesGuard(name, error);
    return /* @__PURE__ */ React.createElement(WrappedComponent, { ...props });
  };
  Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
  return Hoc;
}
export {
  useMaxAllowedInstancesGuard,
  withMaxAllowedInstancesGuard
};
//# sourceMappingURL=useMaxAllowedInstancesGuard.js.map