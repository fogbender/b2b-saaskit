import "../chunk-UKSPFOP7.js";
import React from "react";
function useMagicLink(resource) {
  const { startMagicLinkFlow, cancelMagicLinkFlow } = React.useMemo(() => resource.createMagicLinkFlow(), [resource]);
  React.useEffect(() => {
    return cancelMagicLinkFlow;
  }, []);
  return {
    startMagicLinkFlow,
    cancelMagicLinkFlow
  };
}
export {
  useMagicLink
};
//# sourceMappingURL=useMagicLink.js.map