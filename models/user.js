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

    /**REGISTER USER: user must include all properties of:

            // USER TABLE (email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername)

            //And WRITER TABLE (firstName, lastName, age, bio)

            //OR

            //PLATFORM TABLE (handle, description, display_name)

    /* Returns JWT used to auth further reqs.
    *
    * Auth required: none
    */

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

    /**REMOVE USER
     *
     * Success: {id} => undefined
     *
     * Failure throws NotFoundError
     */

    static async remove(id) {

        let result = await db.query(
            `DELETE FROM users WHERE id=$1 RETURNING writer_id AS writerId, platform_id AS platformId`,
            [id]
        );
        let user = result.rows[0];
        if(!user) throw new NotFoundError(`No User With ID: ${id}`);

        if(user.writerId) {
            await db.query(
                `DELETE FROM writers WHERE id=$1`,
                [user.writerId]
            )
        } else {
            await db.query(
                `DELETE FROM platforms WHERE id=$1`,
                [user.platformId]
            )
        };
    };

    static async getById(id, userType) {
        const result = await db.query(
            `SELECT email,
                writer_id AS writerId,
                platform_id AS platformId,
                image_url AS imageUrl,
                address_1 AS address1,
                address_2 AS address2,
                city,
                state,
                postal_code AS postalCode,
                phone,
                facebook_username AS facebookUsername,
                twitter_username AS twitterUsername,
                youtube_username AS youtubeUsername
                FROM users
                WHERE id=$1`,
                [id]
        );

        const user = result.rows[0];

        if(!user) throw new NotFoundError(`No User With Id: ${id}`);

        if(userType==="writer") {
            const writerRes = await db.query(
                `SELECT *
                FROM writers
                WHERE id=$1`,
                [user.writerid]
            );

            const writer = writerRes.rows[0];

            if(!writer) throw new NotFoundError(`No Writer With ID: ${id}`);

            user.firstName = writer.first_name;
            user.lastName = writer.last_name;
            user.age = writer.age;
            user.bio = writer.bio;
            user.createdAt = writer.created_at;

            const portfolioRes = await db.query(
                `SELECT * FROM portfolios WHERE writer_id=$1`,
                [writer.id]
            );
            user.portfolios = portfolioRes.rows.map(p => ({id: p.id, title: p.title}));
        } else if(userType==="platform") {
            const platformRes = await db.query(
                `SELECT *
                FROM platforms
                WHERE id=$1`,
                [user.platformid]
            );

            const platform = platformRes.rows[0];

            if(!platform) throw new NotFoundError(`No Platform With ID: ${id}`);

            user.handle = platform.handle;
            user.displayName = platform.display_name;
            user.description = platform.description;

            const gigRes = await db.query(
                `SELECT *
                FROM gigs
                WHERE platform_id=$1`,
                [platform.id]
            );

            user.gigs = gigRes.rows.map(g => ({title: g.title, description: g.description, compensation: g.compensation, isRemote: g.is_remote, wordCount: g.word_count, isActive: g.is_active, createdAt: g.created_at}));

        } else {
            throw new BadRequestError('User Type must be string: "writer" OR "platform"');
        }

         return user;
       };

};

module.exports = User;
