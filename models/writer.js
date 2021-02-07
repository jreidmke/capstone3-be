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


    /**FIND ALL WRITERS
     * 
     * Returns [{username, first_name, last_name, image_url, location}, ...]
     */

    static async getAll() {
      const result = await db.query(
        `SELECT w.first_name AS firstName,
          w.last_name AS lastName,
          u.image_url AS imageURL,
          u.city,
          u.state,
          u.facebook_username AS facebookUsername,
          u.twitter_username AS twitterUsername,
          u.youtube_username AS youtubeUsername
        FROM writers AS w
        JOIN users AS u ON w.id=u.writer_id
        ORDER BY lastName`
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

     static async getById(id) {
      const result = await db.query(
        `SELECT w.first_name AS firstName,
          w.last_name AS lastName,
          w.age,
          w.bio,
          w.created_at,
          u.image_url AS imageURL,
          u.address_1 AS address1,
          u.address_2 AS address2,
          u.city,
          u.state,
          u.postal_code AS postalCode,
          u.phone,
          u.facebook_username AS facebookUsername,
          u.twitter_username AS twitterUsername,
          u.youtube_username AS youtubeUsername
        FROM writers AS w
        JOIN users AS u ON w.id=u.writer_id
        WHERE w.id=$1
        ORDER BY lastName`,
        [id]
      );

      const writer = result.rows[0];

      if(!writer) throw new NotFoundError(`No User With Id: ${id}`);

      const portfolioRes = await db.query(
        `SELECT * FROM portfolios WHERE writer_id=$1`,
        [id]
      );
    
      writer.portfolios = portfolioRes.rows.map(p => ({id: p.id, title: p.title}));

       return writer;
     };

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

    static async remove(id) {

      let result = await db.query(
        `DELETE FROM writers WHERE id=$1 RETURNING id`, 
        [id]
      );

      const writer = result.rows[0];
      if(!writer) throw new NotFoundError(`No User With ID: ${id}`);
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