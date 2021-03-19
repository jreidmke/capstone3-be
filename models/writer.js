// WRITER MODEL METHODS

"use strict";
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Writer {

    /**FIND ALL WRITERS
     *
     * Returns [{username, first_name, last_name, image_url, location}, ...]
     */

    static async getAll(searchFilters = {}) {
      let query = `SELECT w.id,
          w.first_name AS "firstName",
          w.last_name AS "lastName",
          w.expertise_1 AS "expertise1",
          w.bio,
          u.image_url AS "imageUrl",
          u.city,
          u.state,
          u.facebook_username AS "facebookUsername",
          u.twitter_username AS "twitterUsername",
          u.youtube_username AS "youtubeUsername",
          COUNT(p.id) AS "pieceCount"
        FROM writers AS w
        JOIN users AS u
        ON w.id=u.writer_id
        JOIN pieces AS p
        ON p.writer_id=w.id`;

      let whereExpressions = [];
      let queryValues = [];
      const { city, state } = searchFilters;
      
      if(city !== undefined && city !== "") {
        queryValues.push(city);
        whereExpressions.push(`city=$${queryValues.length}`);
      };

      if(state !== undefined && state !== "") {
        queryValues.push(state);
        whereExpressions.push(`state=$${queryValues.length}`);
      };

      if(whereExpressions.length > 0) {
        query += " WHERE " + whereExpressions.join(" AND ");
      };
      
      query += ` GROUP BY w.id, u.image_url, u.city, u.state, u.facebook_username, u.twitter_username, u.youtube_username ORDER BY "lastName"`

      const results = await db.query(query, queryValues);
      return results.rows;
    };

    /**FIND WRITER BY id
     *
     * Success: {id} => {username, first_name, last_name, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, portfolios}
     *    where portfolios is { id, title, writer_username }
     *
     * Failure throws NotFoundError
     *
     * Works in tandem with Uesr method getById()
     */


     static async getById(writerId) {
      const result = await db.query(
        `SELECT w.id, 
          w.first_name AS "firstName",
          w.last_name AS "lastName",
          w.age,
          w.bio,
          w.expertise_1 AS "expertise1",
          u.image_url AS "imageUrl",
          u.city,
          u.state,
          u.address_1 AS "address1",
          u.address_2 AS "address2",
          u.postal_code AS "postalCode",
          u.phone,
          u.facebook_username AS "facebookUsername",
          u.twitter_username AS "twitterUsername",
          u.youtube_username AS "youtubeUsername",
          u.created_at AS "createdAt",
          u.last_login_at AS "lastLoginAt",
          t.title AS "expertise1Title",
          u.email
        FROM writers AS w
        JOIN users AS u ON w.id=u.writer_id
        JOIN tags AS t
        ON t.id=w.expertise_1
        WHERE u.writer_id=$1`,
        [writerId]
      );
      const writer = result.rows[0];

      if(!writer) throw new NotFoundError(`Writer with ID: ${writerId} Not Found!`);

      const portfolioRes = await db.query(
        `SELECT id, title, writer_id AS "writerId", created_at AS "createdAt", updated_at AS "updatedAt"
        FROM portfolios
        WHERE writer_id=$1`,
        [writerId]
      );
      writer.portfolios = portfolioRes.rows;
      delete writer.password;
      return writer;
     };

     static async getWritersByExpertise(expertise) {
      const result = await db.query(
        `SELECT w.id,
                w.first_name AS "firstName",
                w.last_name AS "lastName",
                w.expertise_1 AS "expertise1",
                u.city,
                u.state,
                u.image_url AS "imageUrl"
        FROM writers AS w
        JOIN users AS u
        ON w.id=u.writer_id
        WHERE w.expertise_1 IN (${expertise})`
      );
      return result.rows;
    }

     /** Given a writer Id, removes writer from database and returns all data on deleted writer
      *
      */

     static async remove(writerId) {
       const result = await db.query(
         `DELETE FROM users
         WHERE writer_id=$1
         RETURNING *`,
         [writerId]
       );
       return result.rows[0];
     };

       /** Update writer data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, age, bio }
   *
   * Returns { firstName, lastName, age, bio }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(writerId, writerData, userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, BCRYPT_WORK_FACTOR);
    };

    let { setCols, values } = sqlForPartialUpdate(
      writerData,
        {
          firstName: "first_name",
          lastName: "last_name"
        });
    const writerIdVarIdx = "$" + (values.length + 1);

    const writerQuerySql = `UPDATE writers 
                      SET ${setCols} 
                      WHERE id = ${writerIdVarIdx} 
                      RETURNING first_name AS "firstName",
                                last_name AS "lastName",
                                age, bio`;

    const wResult = await db.query(writerQuerySql, [...values, writerId]);
    const writer = wResult.rows[0];

    if (!writer) throw new NotFoundError(`No writer: ${writerId}`);

    async function updateUser() {
      let { setCols, values } = sqlForPartialUpdate(
        userData,
        {
          imageUrl: "image_url",
          address1: "address_1",
          address2: "address_2",
          postalCode: "postal_code",
          expertise1: "expertise_1",
          expertise2: "expertise_2",
          twitterUsername: "twitter_username",
          facebookUsername: "facebook_username",
          youtubeUsername: "youtube_username"
        });
  
        const userIdVarIdx = "$" + (values.length + 1);
      const userQuerySql = `UPDATE users
                        SET ${setCols}
                        WHERE writer_id = ${userIdVarIdx}
                        RETURNING email,
                                  image_url AS "imageUrl",
                                  address_1 AS address1,
                                  address_2 AS address2,
                                  city, state, 
                                  postal_code AS "postalCode",
                                  phone,
                                  twitter_username AS "twitterUsername",
                                  facebook_username AS "facebookUsername",
                                  youtube_username AS "youtubeUsername"`;
      const uResult = await db.query(userQuerySql, [...values, writerId]);
      const user = uResult.rows[0];
      return user;
    }
    const user = await updateUser();
    user.writerData = writer;

    return user;
  }; 

    /**Given a writerId and itemType, returns all all writer follows
    *
    * Returns all data on new follow
    */

     static async getFollows(writerId, itemType) {
      if(itemType === "tag" || itemType === "platform") {
        const select = itemType==="tag" ?
        `title, is_fiction AS "isFiction"` :
        `display_name AS "displayName", description`;

        const result = await db.query(
          `SELECT f.id, 
                  f.writer_id AS "writerId", 
                  f.${itemType}_id AS "${itemType}Id",
                  f.created_at AS "createdAt",
                  f.updated_at AS "updatedAt",
                  ${select}
                  FROM writer_${itemType}_follows AS f
          JOIN ${itemType}s AS t
          ON t.id = f.${itemType}_id
          WHERE f.writer_id=$1`,
          [writerId]
        );
        const follows = result.rows;
        if(!follows) throw new NotFoundError(`Writer with ID: ${writerId} Follows No ${itemType.toUpperCase()}S`);
        return follows;
       }
       throw new BadRequestError("Item Type must be String: 'tag' or 'platform'");
      };


      /**Given a writerId, itemId and itemType, a writer will follow a tag or platform
       *
       * Returns all data on new follow
       */

      static async followItem(writerId, itemId, itemType) {
        if(itemType==="tag" || itemType==="platform") {
          const result = await db.query(
            `INSERT INTO writer_${itemType}_follows (writer_id, ${itemType}_id)
            VALUES($1, $2)
            RETURNING writer_id AS "writerId",
            ${itemType}_id AS ${itemType}Id`,
            [writerId, itemId]
          );
          return result.rows[0];
        };

       throw new BadRequestError("Item Type must be String: 'tag' or 'platform'");
      };

      /**Given a writerId, itemId and itemType, a writer will unfollow a tag or platform
       *
       * Returns all data on new unfollow
       */

      static async unfollowItem(writerId, itemId, itemType) {
        if(itemType==="tag" || itemType==="platform") {
          const result = await db.query(
            `DELETE FROM writer_${itemType}_follows
            WHERE ${itemType}_id=$1
            AND writer_id=$2
            RETURNING writer_id AS "writerId",
            ${itemType}_id AS "${itemType}Id"`,
            [itemId, writerId]
          );
          return result.rows[0];
        };
      };

      static async getGigsForFeedFromTags(tagIds) {
        const result = await db.query(
          `SELECT g.id, 
                  g.platform_id AS "platformId",
                  g.title,
                  g.description,
                  g.deadline,
                  g.compensation,
                  g.is_remote AS "isRemote",
                  g.word_count AS "wordCount",
                  g.is_active AS "isActive",
                  t.title AS "tagTitle",
                  p.display_name AS "displayName",
                  u.image_url AS "imageUrl",
                  u.city,
                  u.state
          FROM gigs AS g
          JOIN gig_tags AS gt
          ON g.id=gt.gig_id
          JOIN tags AS t
          ON gt.tag_id=t.id
          JOIN platforms AS p
          ON g.platform_id=p.id
          JOIN users AS u
          ON p.id=u.platform_id
          WHERE gt.tag_id IN (${tagIds})`
        );
        return result.rows;
      };

      static async getGigsForFeedFromPlatforms(platformIds) {
        const result = await db.query(
          `SELECT g.id, 
                  g.platform_id AS "platformId",
                  g.title,
                  g.description,
                  g.deadline,
                  g.compensation,
                  g.is_remote AS "isRemote",
                  g.word_count AS "wordCount",
                  g.is_active AS "isActive",
                  p.display_name AS "displayName",
                  u.image_url AS "imageUrl",
                  u.city,
                  u.state
          FROM gigs AS g
          JOIN platforms AS p
          ON p.id=g.platform_id
          JOIN users AS u
          ON p.id=u.platform_id
          WHERE p.id IN (${platformIds})`
        );
        return result.rows;
      };

      static async getAllQueriesByWriterId(writerId) {
        const result = await db.query(
          `SELECT q.id,
                  q.platform_id AS "platformId",
                  q.gig_id AS "gigId",
                  q.message,
                  q.created_at AS "createdAt",
                  p.display_name AS "displayName",
                  g.title AS "gigTitle",
                  g.compensation,
                  g.is_remote AS "isRemote",
                  g.word_count AS "wordCount",
                  g.description AS "gigDescription",
                  u.image_url AS "imageUrl"
          FROM queries AS q
          JOIN platforms AS p
          ON q.platform_id=p.id
          JOIN gigs AS g
          ON q.gig_id=g.id
          JOIN users AS u
          ON q.platform_id=u.platform_id
          WHERE q.writer_id=$1`, [writerId]
        );
        return result.rows;
      };

      static async getApplicationMessagesByWriterId(writerId) {
        const result = await db.query(
          `SELECT am.id,
                  am.application_id AS "appId",
                  am.platform_id AS "platformId",
                  am.status,
                  am.created_at AS "createdAt",
                  am.portfolio_id AS "portfolioId",
                  am.gig_id AS "gigId",
                  p.display_name AS "displayName",
                  po.title AS "portfolioTitle",
                  g.title AS "gigTitle"
          FROM application_messages AS am
          JOIN platforms AS p
          ON am.platform_id=p.id
          JOIN portfolios AS po
          ON am.portfolio_id=po.id
          JOIN gigs AS g
          ON am.gig_id=g.id
          WHERE am.writer_id=$1`,
          [writerId]
        );
        return result.rows;
      };

      static async declineGig(applicationId) {
        await db.query(
          `DELETE FROM application_messages
          WHERE application_id=$1`, [applicationId]
        );

        await db.query(
          `DELETE FROM applications WHERE id=$1`, [applicationId]
        )
      };

      static async acceptGig(applicationId) {
        const gigResult = await db.query(
          `SELECT a.id,
                  a.gig_id AS "gigId",
                  a.writer_id AS "writerId",
                  a.status,
                  g.platform_id AS "platformId",
                  g.deadline
                  FROM applications AS a
                  JOIN gigs AS g
                  ON a.gig_id=g.id
            WHERE a.id=$1`, 
            [applicationId]);
        const gig = gigResult.rows[0];
        console.log(gig.id);
        console.log(gig.status);
        if(gig.status !== "Accepted") throw new UnauthorizedError();
        
        await db.query(`DELETE FROM applications WHERE id=$1`, [applicationId]);
        await db.query(`UPDATE gigs SET is_active=FALSE WHERE id=$1`, [gig.gigId]);

        const onGoingResult = await db.query(
          `INSERT INTO ongoing_gigs (gig_id, writer_id, platform_id, deadline)
          VALUES($1, $2, $3, $4)
          RETURNING gig_id AS "gigId", writer_id AS "writerId", platform_id AS "platformId", deadline`,
          [gig.gigId, gig.writerId, gig.platformId, gig.deadline]
        );
        return onGoingResult.rows[0];
      };

      static async getAllOngoingGigs(writerId) {
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
                  p.display_name AS "displayName"
          FROM ongoing_gigs AS o
          JOIN gigs AS g
          ON o.gig_id=g.id
          JOIN platforms AS p
          on o.platform_id=p.id
          WHERE o.writer_id=$1`, [writerId]
        );

        return result.rows;
      };
};

module.exports = Writer;