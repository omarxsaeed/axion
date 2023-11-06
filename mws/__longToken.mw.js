module.exports = ({ meta, config, managers }) => {
  return ({ req, res, next }) => {
    let token = req.headers.authorization;

    if (!token) {
      console.log("token required but not found");
      return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: "unauthorized" });
    }
    token = token.split("Bearer ")[1] ?? token;
    let decoded = null;
    try {
      decoded = managers.token.verifyLongToken({ token });
      if (!decoded) {
        console.log("failed to decode-1");
        return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: "unauthorized" });
      }
    } catch (err) {
      console.log("failed to decode-2");
      return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: "unauthorized" });
    }

    req.user = decoded;

    next(decoded);
  };
};
