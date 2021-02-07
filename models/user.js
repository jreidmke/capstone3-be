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
const { agent } = require("supertest");

class User {

    /**AUTHENTICATE USER
     * Success: {email, password} => {email, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /auth/login route to create JWT used to make further requests.
    */

    static async authenticate(email, password) {
        const result = await db.query(
            `SELECT id, email, password, is_admin
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
    };

    static async register({email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername, firstName, lastName, age, bio, handle, displayName, description}) {

        //duplicate email check
        if(await checkForItem(email, 'users', 'email')) throw new BadRequestError(`Duplicate email: ${email}. Please select another.`);
        
        let user;

        if(firstName) {
            const result = await db.query(
                `INSERT INTO writers (first_name, last_name, age, bio)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [firstName, lastName, age, bio]
            );
            user = result.rows[0];
        } else {
            const result = await db.query(
                `INSERT INTO platforms (handle, display_name, description)
                VALUES ($1, $2, $3)
                RETURNING id`,
                [handle, displayName, description]
            ); 
            user = result.rows[0];
        };

        const hashWord = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users (email, writer_id, platform_id, password, image_url, address_1, address_2, city, state, postal_code, phone, twitter_username, facebook_username, youtube_username)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING email, is_admin`,
            [
                email,
                firstName ? user.id : null,
                firstName ? null : user.id,
                hashWord,
                imageUrl,
                address1,
                address2,
                city,
                state,
                postalCode,
                phone,
                twitterUsername,
                facebookUsername,
                youtubeUsername
            ]
        );
        return result.rows[0];
    }


};

module.exports = User;
