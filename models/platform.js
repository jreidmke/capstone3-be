// PLATFORM MODEL

"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Platform {

  /**Returns All Platforms */

    static async getAll() {
        const result = await db.query(
          `SELECT p.display_name AS "displayName",
            p.description,
            u.image_url AS "imageUrl",
            u.city,
            u.state,
            u.facebook_username AS "facebookUsername",
            u.twitter_username AS "twitterUsername",
            u.youtube_username AS "youtubeUsername"
          FROM platforms AS p
          JOIN users AS u ON p.id=u.platform_id
          ORDER BY "displayName"`
        );
        return result.rows;
      };

    /**Given a platform id, returns a user
     * 
     * Returns {id,email, writer_id, platformId, imageUrl, address1, address2, city, state, postalcode, phone, facebookUsername, twitterUsername, youtubeUsername, displayName, gigs}
     *    where gigs = {id, title, description, compensation, is_remote, wordCount, isActive}
     * 
     * Failure throws not found
     */
 
    static async getById(platformId) {
        const platformRes = await db.query(
          `SELECT p.id, 
              p.display_name AS "displayName",
              p.description,
              u.image_url AS "imageUrl",
              u.city,
              u.state,
              u.facebook_username AS "facebookUsername",
              u.twitter_username AS "twitterUsername",
              u.youtube_username AS "youtubeUsername"
          FROM platforms AS p
          JOIN users AS u ON p.id=u.platform_id
          WHERE p.id=$1`,
          [platformId]
        );

        const platform = platformRes.rows[0];

        if(!platform) throw new NotFoundError(`No Platform With ID: ${platformId}`);

        const gigRes = await db.query(
            `SELECT id, platform_id AS "platformId", title, description, compensation, is_remote AS "isRemote", word_count AS "wordCount", is_active AS "isActive"
            FROM gigs
            WHERE platform_id=$1`,
            [platform.id]
        );

        platform.gigs = gigRes.rows;

        return platform;
    };

    /** Update piece data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { imageUrl, address1, address2, city, state, postalcode, phone, facebookUsername, twitterUsername, youtubeUsername, displayName }
   *
   * Returns the same plus { created_at, updated_at }
   *
   * Throws NotFoundError if not found.
   */

    static async update(platformId, platformData, userData) {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, BCRYPT_WORK_FACTOR);
      };
      let { setCols, values } = sqlForPartialUpdate(
        platformData,
          {
            displayName: "display_name"
          });
      const platformIdVarIdx = "$" + (values.length + 1);
  
      const platformQuerySql = `UPDATE platforms 
                        SET ${setCols} 
                        WHERE id = ${platformIdVarIdx} 
                        RETURNING display_name as displayName,
                                  description`;
  
      const pResult = await db.query(platformQuerySql, [...values, platformId]);
      const platform = pResult.rows[0];
  
      if (!platform) throw new NotFoundError(`No platform: ${platformId}`);
  
      async function updateUser() {
        let { setCols, values } = sqlForPartialUpdate(
          userData,
          {
            imageUrl: "image_url",
            address1: "address_1",
            address2: "address_2",
            postalCode: "postal_code",
            twitterUsername: "twitter_username",
            facebookUsername: "facebook_username",
            youtubeUsername: "youtube_username"
          });
    
          const userIdVarIdx = "$" + (values.length + 1);
        const userQuerySql = `UPDATE users
                          SET ${setCols}
                          WHERE platform_id = ${userIdVarIdx}
                          RETURNING email,
                                    image_url AS "imageUrl",
                                    address_1 AS address1,
                                    address_2 AS address2,
                                    city, state, 
                                    postal_code AS "postalCode",
                                    phone,
                                    twitter_username AS "twitterUsername",
                                    facebook_username AS "facebookUsername",
                                    youtube_username AS "youtubeUsername",
                                    created_at AS "createdAt",
                                    updated_at AS "updatedAt"`;
        const uResult = await db.query(userQuerySql, [...values, platformId]);
        const user = uResult.rows[0];
        return user;
      }
      const user = await updateUser();
      user.platformData = platform;
  
      return user;
    };

    /** Delete given platform from database; returns all data on deleted platform.
    *
    * Throws NotFoundError if piece not found
    **/

    static async remove(platformId) {
      const result = await db.query(
        `DELETE FROM users
        WHERE platform_id=$1
        RETURNING *`,
        [platformId]
      );
      const platform = result.rows[0];
      if(!platform) throw new NotFoundError(`Platform: ${platformId} Not Found!`);
      return platform;
    };

    /**Given a platformId and itemType, returns all all platform follows
    *
    * Returns all data on new follow
    */

    static async getFollows(platformId, itemType) {
      if(itemType === "tag" || itemType === "writer") {
        const select = itemType==="tag" ?
        `title, is_fiction AS "isFiction"` :
        `first_name AS "firstName", last_name AS lastName, age, bio`
        
        const result = await db.query(
          `SELECT f.id, f.platform_id AS "platformId", ${itemType}_id AS "${itemType}Id", f.created_at AS "createdAt", f.updated_at AS "updatedAt", ${select} 
          FROM platform_${itemType}_follows AS f
          JOIN ${itemType}s AS t
          ON t.id = f.${itemType}_id
          WHERE f.platform_id=$1`,
          [platformId]
        );

        const follows = result.rows;
        if(!follows) throw new NotFoundError(`Platform with ID: ${platformId} Follows No ${itemType.toUpperCase()}S`);
        return follows;

       };

       throw new BadRequestError("Item Type must be String: 'tag' or 'writer'");
      };

      /**Given a platformId, itemId and itemType, a platform will follow a tag or writer
       *
       * Returns all data on new follow
       */

      static async followItem(platformId, itemId, itemType) {
        if(itemType==="tag" || itemType==="writer") {
          const result = await db.query(
            `INSERT INTO platform_${itemType}_follows (platform_id, ${itemType}_id)
            VALUES($1, $2)
            RETURNING platform_id AS "platformId",
            ${itemType}_id AS "${itemType}Id"`,
            [platformId, itemId]
          );
          return result.rows[0];
        };

       throw new BadRequestError("Item Type must be String: 'tag' or 'writer'");
      };

      /**Given a platformId, itemId and itemType, a platform will unfollow a tag or writer
       *
       * Returns all data on new unfollow
       */

      static async unfollowItem(platformId, itemId, itemType) {
        if(itemType==="tag" || itemType==="writer") {
          const result = await db.query(
            `DELETE FROM platform_${itemType}_follows
            WHERE ${itemType}_id=$1
            AND platform_id=$2
            RETURNING platform_id AS "platformId",
            ${itemType}_id AS "${itemType}Id"`,
            [itemId, platformId]
          );

          return result.rows[0];
        };
        throw new BadRequestError("Item Type must be String: 'tag' or 'writer'");
      };
};

module.exports = Platform;