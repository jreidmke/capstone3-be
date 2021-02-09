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

            //And WRITER TABLE (firstName, lastName, age, bio) OR PLATFORM TABLE (handle, description, display_name)

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

    /**GET USER BY ID
     *
     * Success: {id, userType(string: either "writer" OR "platform")} => RETURNS:
     *
     * ALL DATA on selected WRITER, including PORTOLIOS OR ALL DATA on selected PLATFORM, including GIGS
     *
     * FAILURE throws NotFoundError or BadRequest
     *
     * Works in tandem with either Writer.getById method OR Platform.getById method
     */

    static async getById(id, userType) {
        const result = await db.query(
            `SELECT id,
                email,
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

        let user = result.rows[0];

        if(!user) throw new NotFoundError(`No User With Id: ${id}`);

        if(userType==="writer") {
            user = Writer.getById(user);
        } else if(userType==="platform") {
            user = Platform.getById(user);
        } else {
            throw new BadRequestError('User Type must be string: "writer" OR "platform"');
        }
         return user;
    };
};

module.exports = User;

    /**GET USER TAG FOLLOWS
     *
     * SUCCESS {id, userType string} => [{id, writer_id, tag_id, timestamps},...]
     *
     * Failure returns NotFoundError OR BadRequestError
     */

    // static async getItemFollows(id, userType, itemType) {
    //     if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

    //         //Error handling
    //         const user = await getUserHelper(id);
    //         if(!user) throw new NotFoundError(`No User With ID: ${id}`);

    //         const itemRes = await db.query(
    //             `SELECT *
    //             FROM ${userType}_${itemType}_follows AS f
    //             JOIN ${itemType}s AS i ON f.${itemType}_id=i.id
    //             WHERE ${userType}_id=$1`,
    //             [user.writer_id ||user.platform_id]
    //         );
    //         const items = itemRes.rows;
    //         if(!items.length) throw new NotFoundError(`User with ID: ${id} not following any ${itemType}s!`);
    //         return items;
    //     }
    //     throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    // };

    // /**FOLLOW ITEM
    //  *
    //  * SUCESS: {id, itemId, userType string, itemType} => [followed: {writer_id, tag_id, tag_title}]
    //  *
    //  * Failure returns NotFoundError OR BadRequestError
    //  */

    // static async followItem(userId, itemId, userType, itemType){
    //     if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

    //         //error handling

    //         const user = await getUserHelper(userId);
    //         if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
    //         const item = await checkForItem(itemId, `${itemType}s`, 'id');
    //         if(!item) throw new NotFoundError(`No ${itemType} With Id: ${itemId}`);
    //         if(await checkForFollow(user.writer_id || user.platform_id, itemId, userType, itemType)) {
    //             throw new BadRequestError(`${userType} ${userId} already follows ${itemType} ${itemId}`);
    //         };

    //         //Insert into DB
    //         const followRes = await db.query(
    //             `INSERT INTO ${userType}_${itemType}_follows (${userType}_id, ${itemType}_id)
    //             VALUES ($1, $2)
    //             RETURNING ${itemType}_id AS ${itemType}Id, ${userType}_id AS ${userType}Id`,
    //             [user.writer_id ||user.platform_id, itemId]
    //         );

    //         //Return data to user
    //         const newFollow = followRes.rows[0];
    //         newFollow.title = item.title || item.display_name;
    //         return newFollow;
    //     }

    //     throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    // };

    // /**UNFOLLOW ITEM
    //  *
    //  * SUCESS: {id, itemId, userType string, itemType} => [followed: {writer_id, tag_id, tag_title}]
    //  *
    //  * Failure returns NotFoundError OR BadRequestError
    //  */

    // static async unfollowItem(userId, itemId, userType, itemType) {
    //     if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

    //         //error handling
    //         const user = await getUserHelper(userId);
    //         if(!user) throw new NotFoundError(`No User With ID: ${id}`);
    //         const item = await checkForItem(itemId, `${itemType}s`, 'id');
    //         if(!item) throw new NotFoundError(`No ${itemType} With Id: ${itemId}`);
    //         if(!await checkForFollow(user.writer_id || user.platform_id, itemId, userType, itemType)) {
    //             throw new BadRequestError(`${userType} ${userId} doesn't follow ${itemType} ${itemId}`);
    //         };

    //         //DELETE from database
    //         const unfollowRes = await db.query(
    //             `DELETE FROM ${userType}_${itemType}_follows
    //             WHERE ${userType}_id=$1
    //             AND ${itemType}_id=$2
    //             RETURNING ${itemType}_id AS ${itemType}Id, ${userType}_id AS ${userType}Id`,
    //             [user.writer_id ||user.platform_id, itemId]
    //         );

    //         //return data to user
    //         const unfollow = unfollowRes.rows[0];
    //         unfollow.title = item.title || item.display_name;
    //         return unfollow;
    //     };

    //     throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    // }