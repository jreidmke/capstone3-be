// WRITER MODEL METHODS

"use strict";
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
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
          w.bio,
          u.image_url AS "imageUrl",
          u.city,
          u.state,
          u.facebook_username AS "facebookUsername",
          u.twitter_username AS "twitterUsername",
          u.youtube_username AS "youtubeUsername"
        FROM writers AS w
        JOIN users AS u ON w.id=u.writer_id`;

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
      
      query += ` ORDER BY "lastName"`

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
        `SELECT w.first_name AS "firstName",
          w.last_name AS "lastName",
          w.age,
          w.bio,
          u.image_url AS "imageUrl",
          u.city,
          u.state,
          u.address_1 AS "address1",
          u.address_2 AS "address2",
          u.postal_code AS "postalCode",
          u.phone,
          u.facebook_username AS "facebookUsername",
          u.twitter_username AS "twitterUsername",
          u.youtube_username AS "youtubeUsername"
        FROM writers AS w
        JOIN users AS u ON w.id=u.writer_id
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
        const result = await db.query(
          `SELECT * FROM writer_${itemType}_follows AS f
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
            RETURNING writer_id AS writerId,
            ${itemType}_id AS ${itemType}Id`,
            [itemId, writerId]
          );
          return result.rows[0];
        };
      };
};

module.exports = Writer;