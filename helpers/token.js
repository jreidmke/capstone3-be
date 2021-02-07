const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user, isPlatform=false) {
  console.assert(user.isAdmin !== undefined, "createToken passed user without isAdmin property");

  if(isPlatform) user.username = user.handle;

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
    isPlatform: isPlatform
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };