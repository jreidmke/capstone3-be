// WRITER MODEL METHODS

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const checkForItem = require('../helpers/checks');

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

    /**AUTHENTICATE USER
     * Success: {email, password} => {email, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /auth/login route to create JWT used to make further requests.
    */

    static async authenticate(email, password) {
        const result = await db.query(
            `SELECT email, password, is_admin
            FROM users
            WHERE email=$1`,
            [email]
        );
        const user = result.rows[0]; 

        if(user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if(validPassword === true) {
                delete user.password;
                return user;
            };
        };
        throw new UnauthorizedError('Invaid username/password');
    }
};

module.exports = User;
