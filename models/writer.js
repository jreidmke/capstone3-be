// WRITER MODEL METHODS

"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");


class Writer {

    /**FIND ALL WRITERS
     *
     * Returns [{username, first_name, last_name, image_url, location}, ...]
     */

    static async getAll() {
      const result = await db.query(
        `SELECT w.first_name AS firstName,
          w.last_name AS lastName,
          w.bio,
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
     *
     * Works in tandem with Uesr method getById()
     */

     static async getById(writerId) {
      const result = await db.query(
        `SELECT * FROM users AS u
        JOIN writers AS w
        ON u.writer_id=w.id
        WHERE u.writer_id=$1`,
        [writerId]
      );
      const writer = result.rows[0];

      if(!writer) throw new NotFoundError(`Writer with ID: ${writerId} Not Found!`);

      delete writer.password;
      return writer;
     };

     static async remove(writerId) {
       const result = await db.query(
         `DELETE FROM users
         WHERE writer_id=$1
         RETURNING writer_id AS writerId`,
         [writerId]
       );
       const writer = result.rows[0];
       if(!writer) throw new NotFoundError(`Writer with ID: ${writerId} Not Found!`);
       return 'deleted'
     };

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

      static async followItem(writerId, itemId, itemType) {
        if(itemType==="tag" || itemType==="platform") {

          //CHECK IF WRITER ALREADY FOLLOWS
          const duplicateCheck = await db.query(
            `SELECT * FROM writer_${itemType}_follows
            WHERE writer_id=$1 AND ${itemType}_id=$2`,
            [writerId, itemId]
          );
          if(duplicateCheck.rows[0]) throw new BadRequestError(`Writer: ${writerId} already follows ${itemType.toUpperCase()}: ${itemId}`); 


          const result = await db.query(
            `INSERT INTO writer_${itemType}_follows (writer_id, ${itemType}_id)
            VALUES($1, $2)
            RETURNING writer_id AS writerId,
            ${itemType}_id AS ${itemType}Id`,
            [writerId, itemId]
          );
          return result.rows[0];
        };

       throw new BadRequestError("Item Type must be String: 'tag' or 'platform'");
      };

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

          //CHECK TO SEE IF THEY EVEN FOLLOWED
          if(!result.rows[0]) throw new NotFoundError(`Writer: ${writerId} does not follow ${itemType.toUpperCase()}: ${itemId}`);

          return result.rows[0];
        };
      };
};

module.exports = Writer;