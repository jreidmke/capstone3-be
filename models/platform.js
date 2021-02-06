// PLATFORM MODEL

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Platform {

    /** AUTHENTICATE PLATFORM
    Success: {username, password} => {username, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /platforms/login route to create JWT used to make further requests.
    */
    
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username, password, is_admin
            FROM platforms
            WHERE username=$1`,
            [username]
        ); 
        const user = result.rows[0]; 

        if(user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if(validPassword === true) {
                delete user.password;
                return user;
            };
            throw new UnauthorizedError('Invalid username/password');
        }; 
    }; 
}

module.exports = Platform;

// REGISTER 
// -INPUT: platform_name, password, location, description, logo_url, email, phone, twitter_url, facebook_url, youtube_url, is_admin
// -Success returns all data except password
// Failure throws BadRequestError
// Limitations: Register platform schema

// FIND ALL
// -Success returns all data on all companies

// GET PLATFORM
// -INPUT: platform_name
// -Success: Returns all data on platform except password
// -Failure: errorNotFound

// UPDATE PLATFORM
// -INPUT: platform_name, updatedData
// -Success returns updatedData
// -Failure throws not found error
// -LIMITATIONS: AGAIN!!! ALOT OF LIMITATIONS. ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectPlatformOrAdmin and update platform schema. 

// REMOVE PLATFORM
// -INPUT: platform_name
// -Success returns undefined
// -Failure throws errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin 