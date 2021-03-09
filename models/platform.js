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

    static async getAll(searchFilters = {}) {
        let query = `SELECT p.id, 
            p.display_name AS "displayName",
            p.description,
            u.image_url AS "imageUrl",
            u.city,
            u.state,
            u.facebook_username AS "facebookUsername",
            u.twitter_username AS "twitterUsername",
            u.youtube_username AS "youtubeUsername",
            COUNT(g.id) AS "gigCount"
          FROM platforms AS p
          JOIN users AS u 
          ON p.id=u.platform_id
          JOIN gigs AS g
          ON g.platform_id=p.id`;


        let whereExpressions = [];
        let queryValues = [];
        const { city, state } = searchFilters;
        
        if(city !== undefined && city !== "") {
          queryValues.push(city);
          whereExpressions.push(`u.city=$${queryValues.length}`);
        };
  
        if(state !== undefined && state !== "") {
          queryValues.push(state);
          whereExpressions.push(`u.state=$${queryValues.length}`);
        };
  
        if(whereExpressions.length > 0) {
          query += " WHERE " + whereExpressions.join(" AND ");
        };

        query += `  GROUP BY p.id, u.image_url, u.city, u.state, u.facebook_username, u.twitter_username, u.youtube_username ORDER BY "displayName"`;
        const results = await db.query(query, queryValues);
        return results.rows;      
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
              u.postal_code AS "postalCode",
              u.address_1 AS address1,
              u.address_2 AS address2,
              u.phone,
              u.facebook_username AS "facebookUsername",
              u.twitter_username AS "twitterUsername",
              u.youtube_username AS "youtubeUsername",
              u.last_login_at AS "lastLoginAt",
              u.created_at AS "createdAt",
              u.email
          FROM platforms AS p
          JOIN users AS u ON p.id=u.platform_id
          WHERE p.id=$1`,
          [platformId]
        );

        const platform = platformRes.rows[0];

        if(!platform) throw new NotFoundError(`No Platform With ID: ${platformId}`);

        const gigRes = await db.query(
            `SELECT g.id, 
                    g.platform_id AS "platformId", 
                    g.title, description, compensation, 
                    g.is_remote AS "isRemote", 
                    g.word_count AS "wordCount", 
                    g.is_active AS "isActive",
                    u.image_url AS "imageUrl",
                    g.deadline,
                    g.is_active AS "isActive"
            FROM gigs AS g
            JOIN users AS u
            ON g.platform_id=u.platform_id
            WHERE g.platform_id=$1`,
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
        `first_name AS "firstName", last_name AS "lastName", age, bio`
        
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


      static async getPiecesForFeedFromTags(tagIds) {
        const result = await db.query(
          `SELECT p.id AS "pieceId",
                  p.title AS "title",
                  p.text,
                  p.writer_id AS "writerId",
                  p.created_at AS "createdAt",
                  w.first_name AS "firstName",
                  w.last_name AS "lastName",
                  t.id,
                  t.title AS "tagTitle",
                  u.image_url AS "imageUrl"
            FROM pieces AS p
            JOIN writers AS w
            ON p.writer_id=w.id
            JOIN piece_tags AS pt
            ON pt.piece_id=p.id
            JOIN tags AS t
            ON pt.tag_id=t.id
            JOIN users AS u
            ON p.writer_id=u.writer_id
            WHERE pt.tag_id IN (${tagIds})`
        );
        return result.rows;
      };

      static async getPiecesForFeedFromWriters(writerIds) {

        const result = await db.query(
          `SELECT p.id AS "pieceId",
                  p.title,
                  p.text,
                  p.writer_id AS "writerId",
                  p.created_at AS "createdAt",
                  w.first_name AS "firstName",
                  w.last_name AS "lastName",
                  u.image_url AS "imageUrl"
            FROM pieces AS p
            JOIN writers AS w
            ON p.writer_id=w.id
            JOIN users AS u
            ON p.writer_id=u.writer_id
            WHERE w.id IN (${writerIds})`
        );
        return result.rows;
      };

      static async getAllOngoingGigs(platformId) {
        const result = await db.query(
          `SELECT o.id,
                  o.gig_id AS "gigId",
                  o.writer_id AS "writerId",
                  o.platform_id AS "platformId",
                  o.deadline,
                  g.title,
                  g.description,
                  g.compensation,
                  g.word_count AS "wordCount",
                  w.first_name AS "firstName",
                  w.last_name AS "lastName",
                  o.created_at AS "createdAt"
          FROM ongoing_gigs AS o
          JOIN gigs AS g
          ON o.gig_id=g.id
          JOIN writers AS w
          on o.writer_id=w.id
          WHERE o.platform_id=$1`, [platformId]
        );

        return result.rows;
      };
};

module.exports = Platform;