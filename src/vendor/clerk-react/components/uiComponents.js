import "../chunk-UKSPFOP7.js";
import React from "react";
import { withClerk } from "./withClerk";
class Portal extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.portalRef = React.createRef();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.props.appearance !== this.props.props.appearance) {
      this.props.updateProps({ node: this.portalRef.current, props: this.props.props });
    }
  }
  componentDidMount() {
    if (this.portalRef.current) {
      this.props.mount(this.portalRef.current, this.props.props);
    }
  }
  componentWillUnmount() {
    if (this.portalRef.current) {
      this.props.unmount(this.portalRef.current);
    }
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { ref: this.portalRef });
  }
}
const SignIn = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountSignIn,
      unmount: clerk.unmountSignIn,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "SignIn");
const SignUp = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountSignUp,
      unmount: clerk.unmountSignUp,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "SignUp");
const UserProfile = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountUserProfile,
      unmount: clerk.unmountUserProfile,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "UserProfile");
const UserButton = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountUserButton,
      unmount: clerk.unmountUserButton,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "UserButton");
const OrganizationProfile = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountOrganizationProfile,
      unmount: clerk.unmountOrganizationProfile,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "OrganizationProfile");
const CreateOrganization = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountCreateOrganization,
      unmount: clerk.unmountCreateOrganization,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "CreateOrganization");
const OrganizationSwitcher = withClerk(({ clerk, ...props }) => {
  return /* @__PURE__ */ React.createElement(
    Portal,
    {
      mount: clerk.mountOrganizationSwitcher,
      unmount: clerk.unmountOrganizationSwitcher,
      updateProps: clerk.__unstable__updateProps,
      props
    }
  );
}, "OrganizationSwitcher");
export {
  CreateOrganization,
  OrganizationProfile,
  OrganizationSwitcher,
  SignIn,
  SignUp,
  UserButton,
  UserProfile
};
//# sourceMappingURL=uiComponents.js.map