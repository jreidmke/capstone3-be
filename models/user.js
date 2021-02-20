// WRITER MODEL METHODS

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const {checkForItem} = require('../helpers/checks');
const Writer = require("./writer");
const Platform = require("./platform");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

    /**AUTHENTICATE USER
     * Success: {email, password} => {email, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /auth/login route to create JWT used to make further requests.
    */

    static async authenticate(email, password) {
        const result = await db.query(
            `SELECT id, email, password, writer_id, platform_id, is_admin
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

    /**REGISTER USER: user must include all properties of:

            // USER TABLE (email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername)

            //And WRITER TABLE (firstName, lastName, age, bio) OR PLATFORM TABLE (description, display_name)

    /* Returns JWT used to auth further reqs.
    *
    * Auth required: none
    */

    static async register({email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername, firstName, lastName, age, bio, displayName, description}) {

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
                `INSERT INTO platforms (display_name, description)
                VALUES ($1, $2)
                RETURNING id`,
                [displayName, description]
            );
            user = result.rows[0];
        };

        const hashWord = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users (email, writer_id, platform_id, password, image_url, address_1, address_2, city, state, postal_code, phone, twitter_username, facebook_username, youtube_username)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id, email, is_admin, writer_id, platform_id`,
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

    /**GET USER BY ID
     * 
     * Used for frontend auth purposes. Returns all data on user to store in REACT CONTEXT. 
     */

   static async getById(userId) {
        const userResult = await db.query(
            `SELECT email, 
                    writer_id AS "writerId", 
                    platform_id AS "platformId",  
                    image_url AS "imageUrl", 
                    address_1 AS address1, 
                    address_2 AS address2, 
                    city, 
                    state, 
                    postal_code AS "postalCode", 
                    phone, 
                    twitter_username AS "twitterUsername", 
                    facebook_username AS "facebookUsername", 
                    youtube_username AS "youtubeUsername"
                FROM users
                WHERE id=$1`,
                [userId]
        );
        const user = userResult.rows[0];
        if(!user) throw new NotFoundError(`User: ${userId} not Found!`);
        if(user.writerId) {
            const writerRes = await db.query(
                `SELECT first_name AS "firstName",
                        last_name AS "lastName",
                        age, bio
                FROM writers
                WHERE id=$1`,
                [user.writerId]
            );
            const writer = writerRes.rows[0];
            user.firstName = writer.firstName;
            user.lastName = writer.lastName;
            user.age = writer.age;
            user.bio = writer.bio;
        } else {
            const platformRes = await db.query(
                `SELECT display_name AS "displayName",
                        description
                FROM platforms
                WHERE id=$1`,
                [user.platformId]
            );
            const platform = platformRes.rows[0];
            user.displayName = platform.displayName;
            user.description = platform.description;
        };
        return user;
   }
};

module.exports = User;