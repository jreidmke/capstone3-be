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
        console.log(user);
        if(user) {
            const validPassword = await bcrypt.compare(password, user.password);
            console.log(validPassword);
            if(validPassword === true) {
                delete user.password;
                return user;
            };
            throw new UnauthorizedError('Invalid username/password');
        }; 
    };

    /**REGISTER PLATFORM
     * Success: ALL PLATFORM PROPERTIES except description & is_admin => { username, isAdmin }
     * Failure throws BadRequestError
     * Works in tandem with /platforms/register to create JWT to make further reqs. 
     */

    static async register({username, password, handle, displayName, location, description, logoUrl, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin}) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM platforms
            WHERE username = $1`, 
            [username]
        );

        if(duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        };

        const hashWord = await bcrypt.hash(password, BCRYPT_WORK_FACTOR); 

        const result = await db.query(
            `INSERT INTO platforms(
                username,
                password,
                handle,
                display_name,
                location,
                description,
                logo_url,
                email,
                phone,
                twitter_username,
                facebook_username,
                youtube_username,
                is_admin
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING username, is_admin AS isAdmin`,
            [username, hashWord, handle, displayName, location, description, logoUrl, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin]
        );

        const user = result.rows[0];

        return user;
    };
};

module.exports = Platform;

// REGISTER 
// -INPUT: username, platform_name, password, location, description, logo_url, email, phone, twitter_url, facebook_url, youtube_url, is_admin
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