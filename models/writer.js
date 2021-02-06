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

class Writer {

     /** AUTHENTICATE WRITER
    Success: {username, password} => {username, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /writers/login route to create JWT used to make further requests.
    */

    static async authenticate(username, password) {
        const result = await db.query(
                `SELECT username, password, is_admin
                FROM writers
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
        };
        throw new UnauthorizedError('Invaid username/password');
    }; 

    /**REGISTER WRITER
     * Success: ALL WRITER PROPERTIES except bio & is_admin => { username, isAdmin }
     * Failure throws BadRequestError
     * Works in tandem with /writers/register to create JWT to make further reqs. 
     */

    static async register({username, password, firstName, lastName, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin}) {
      if(await checkForItem(username, 'writers', 'username')) throw new BadRequestError(`Duplicate username: ${username}. Please select another.`);

      const hashWord = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      const result = await db.query(
        `INSERT INTO writers(
          username,
          password,
          first_name,
          last_name,
          age,
          location,
          email,
          phone,
          twitter_username,
          facebook_username,
          youtube_username,
          is_admin
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING username, is_admin AS isAdmin`, 
        [username, hashWord, firstName, lastName, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin]
      );

      const user = result.rows[0];

      return user;
    }; 

    /**FIND ALL WRITERS
     * 
     * Returns [{username, first_name, last_name, image_url, location}, ...]
     */

    static async getAll() {
      const result = await db.query(
        `SELECT username,
          first_name AS firstName,
          last_name AS lastName,
          image_url AS imageUrl,
          location
        FROM writers
        ORDER BY username`
      );
      return result.rows;
    };

    /**FIND WRITER BY USERNAME
     * 
     * Success: {username} => {username, first_name, last_name, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, portfolios}
     *    where portfolios is { id, title, writer_username }
     * 
     * Failure throws NotFoundError
     */

     static async getByUsername(username) {
       const result = await db.query(
         `SELECT username,
            first_name AS firstName,
            last_name AS lastName,
            image_url AS imageUrl,
            location,
            email,
            phone,
            twitter_username AS twitterUsername,
            facebook_username AS facebookUsername,
            youtube_username AS youtubeUsername
          FROM writers
          WHERE username=$1`,
          [username]
       );

       const writer = result.rows[0];

       if(!writer) throw new NotFoundError(`No User: ${username}`);

       const portfolioRes = await db.query(
         `SELECT * FROM portfolios WHERE writer_username=$1`,
         [username]
       );
       writer.portfolios = portfolioRes.rows.map(p => ({id: p.id, title: p.title, writer_username: p.writer_username}));
       return writer;
     }

     // UPDATE WRITER
    // -Input: username <=this is not changable! this is just for verification, password, first_name, last_name, age, location, email, phone, twitter_url, youtube_url, facebook_url
    // -Success returns all data on writer except password
    // -Failure Throws NotFoundError
    // Limitations: ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectUserOrAdmin and update writer schema. 

    /**REMOVE WRITER
     * 
     * Success: {username} => undefined
     * 
     * Failure throws NotFoundError
     */

    static async remove(username) {

      let result = await db.query(
        `DELETE FROM writers WHERE username=$1 RETURNING username`, 
        [username]
      );

      const writer = result.rows[0];
      if(!writer) throw new NotFoundError(`No User: ${username}`);
    };

    /**GET FOLLOWED TAGS: {username} => [{username, tagTitle}, ...] 
     * 
     * Failure throws NotFoundError
    */

    static async getFollowedTags(username) {
      if(!await checkForItem(username, 'writers', 'username')) throw new NotFoundError(`No user: ${username}`);

      let result = await db.query(
        `SELECT * 
          FROM writer_follows_tag 
          WHERE writer_username=$1`,
          [username]
      );

      const followedTags = result.rows;

      if(!followedTags.length) throw new NotFoundError(`User: ${username} follows no tags.`);
      
      return followedTags;
    };

    /**FOLLOW TAG: {username, tagTitle} => {username, tagTitle}
     * 
     * Failure throws NotFoundError
     */

    static async followTag(username, tagTitle) {
      const writer = await checkForItem(username, 'writers', 'username');
      if(!writer) throw new NotFoundError(`No User: ${username}`);

      const tag = await checkForItem(tagTitle, 'tags', 'title');
      if(!tag) throw new NotFoundError(`No Tag: ${tagTitle}`);

      let result = await db.query(
        `INSERT INTO writer_follows_tag
        VALUES($1, $2)
        RETURNING 
        writer_username AS username,
        tag_title AS tagTitle
        `,
        [writer.username, tag.title]
      ); 

      return result.rows[0];
    };

    /**UNFOLLOW TAG: {username, tagTitle} => {username, tagTitle} 
     * 
     * Failure throws NotFoundError.
    */

    static async unfollowTag(username, tagTitle) {
      const writer = await checkForItem(username, 'writers', 'username');
      if(!writer) throw new NotFoundError(`No User: ${username}`);

      const tag = await checkForItem(tagTitle, 'tags', 'title');
      if(!tag) throw new NotFoundError(`No Tag: ${tagTitle}`);

      let result = await db.query(
        `DELETE FROM writer_follows_tag
        WHERE writer_username=$1
        AND tag_title=$2
        returning writer_username AS username,
        tag_title AS tagTitle`,
        [writer.username, tag.title]
      );

      return result.rows[0];
    };

    /**GET FOLLOWED PLATFORMS: {username} => [{username, platformHandle}, ...] 
     * 
     * Failure throws NotFoundError
    */

    static async getFollowedPlatforms(username) {
      if(!await checkForItem(username, 'writers', 'username')) throw new NotFoundError(`No user: ${username}`);
      
      const result = await db.query(
        `SELECT * FROM writer_follows_platform
        WHERE writer_username=$1`,
        [username]
      );

      const platformFollows = result.rows;
      if(!platformFollows.length) throw new NotFoundError(`User: ${username} follows no platforms.`);

      return platformFollows;
    };

    /**FOLLOW PLATFORM: {username, platformHandle} => {username, platformHandle}
     * 
     * Failure throws NotFoundError
     */

    static async followPlatform(username, platformHandle) {
      const writer = await checkForItem(username, 'writers', 'username');
      if(!writer) throw new NotFoundError(`No User: ${username}`);

      const platform = await checkForItem(platformHandle, 'platforms', 'handle');
      if(!platform) throw new NotFoundError(`No Platform: ${platformHandle}`); 

      const result = await db.query(
        `INSERT INTO writer_follows_platform
        VALUES($1, $2)
        RETURNING writer_username AS username,
        platform_handle AS platformHandle`,
        [writer.username, platform.handle]
      );
      return result.rows[0];
    };

    static async unfollowPlatform(username, platformHandle) {
      const writer = await checkForItem(username, 'writers', 'username');
      if(!writer) throw new NotFoundError(`No Username: ${username}`);

      const platform = await checkForItem(platformHandle, 'platforms', 'handle');
      if(!platform) throw new NotFoundError(`No Platform: ${platformHandle}`); 

      const result = await db.query(
        `DELETE FROM writer_follows_platform
        WHERE writer_username=$1
        AND platform_handle=$2
        returning writer_username AS username,
        platform_handle AS platformHandle`,
        [writer.username, platform.handle]
      );

      return result.rows[0];
    }
};



module.exports = Writer;







// FOLLOW PLATFORM
// -Input: Username, platform name
// -Success returns username, platformname
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin, json schema for follow platform.