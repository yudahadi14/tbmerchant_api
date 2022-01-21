const jwt = require("jsonwebtoken");

exports.regenerateToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_TOKEN_KEY,
    function (err, decoded) {
      if (err) {
        return {
          error : err
        };
      }
      return decoded;
    }
  );
};

exports.verifyAuth = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_TOKEN_KEY,
    function (err, decoded) {
      if (err) {
        return {
          error: err,
        };
      }
      return decoded;
    }
  );
}

exports.signRefreshJwt = (data) => {
  return jwt.sign(data, process.env.JWT_REFRESH_TOKEN_KEY, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  });
};

exports.signAuthJwt = (data) => {
  return jwt.sign(data, process.env.JWT_AUTH_TOKEN_KEY, {
    expiresIn: process.env.JWT_AUTH_TIME,
  });
};
