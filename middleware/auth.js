"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username, isAdmin and isPlatform field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
};

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
};


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.id === req.params.id))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

function ensureCorrectWriterOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if(!user) throw new UnauthorizedError();
    user.writerId = +user.writerId;
    if(!(user && (user.isAdmin || (user.writerId == req.params.writer_id && user.platformId === null)))) {
      throw new UnauthorizedError();
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

function ensureCorrectPlatformOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if(!user) throw new UnauthorizedError();
    user.platformId = + user.platformId;
    if(!(user && (user.isAdmin || (user.platformId == req.params.platform_id && user.writerId === null)))) {
      throw new UnauthorizedError();
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureCorrectWriterOrAdmin,
  ensureCorrectPlatformOrAdmin
};
