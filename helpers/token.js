const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    writerId: user.writer_id,
    platformId: user.platform_id,
    isAdmin: user.is_admin || false
  };
  return jwt.sign(payload, SECRET_KEY);
};


module.exports = { createToken };