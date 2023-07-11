function isKnownError(error) {
  return isClerkAPIResponseError(error) || isMetamaskError(error);
}
function isClerkAPIResponseError(err) {
  return "clerkError" in err;
}
function isMetamaskError(err) {
  return "code" in err && [4001, 32602, 32603].includes(err.code) && "message" in err;
}
function parseErrors(data = []) {
  return data.length > 0 ? data.map(parseError) : [];
}
function parseError(error) {
  return {
    code: error.code,
    message: error.message,
    longMessage: error.long_message,
    meta: {
      paramName: error?.meta?.param_name,
      sessionId: error?.meta?.session_id,
      emailAddresses: error?.meta?.email_addresses
    }
  };
}
class ClerkAPIResponseError extends Error {
  constructor(message, { data, status }) {
    super(message);
    this.toString = () => {
      return `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map(
        (e) => JSON.stringify(e)
      )}`;
    };
    Object.setPrototypeOf(this, ClerkAPIResponseError.prototype);
    this.status = status;
    this.message = message;
    this.clerkError = true;
    this.errors = parseErrors(data);
  }
}
class MagicLinkError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    Object.setPrototypeOf(this, MagicLinkError.prototype);
  }
}
function isMagicLinkError(err) {
  return err instanceof MagicLinkError;
}
const MagicLinkErrorCode = {
  Expired: "expired",
  Failed: "failed"
};
export {
  ClerkAPIResponseError,
  MagicLinkError,
  MagicLinkErrorCode,
  isClerkAPIResponseError,
  isKnownError,
  isMagicLinkError,
  isMetamaskError,
  parseError,
  parseErrors
};
//# sourceMappingURL=Error.js.map