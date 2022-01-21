const jwt = require("jsonwebtoken");
const { verifyAuth } = require("../helpers/utility/jwt");
const { error } = require("../helpers/utility/response");
const auth = (req, res, next) => {
  const auth = req.header("x-auth-token");
  if (!auth) {
    return error(req, res, "Token Invalid.", 400);
  }
  const verify = verifyAuth(auth);

  if (verify.error) {
    if (verify.name === "JsonWebTokenError") {
      return error(req, res, {}, "Token Invalid!.", 400);
    } else if (verify.name == "TokenExpiredError") {
      return error(req, res, {}, "Token Expired!.", 400);
    } else {
      return error(req, res, {}, "Token Invalid!.", 400);
    }
  }

  req.user = verify;
  return next();
};

module.exports = auth;
