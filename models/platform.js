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

    static async getAll() {
        const result = await db.query(
          `SELECT p.handle AS handle,
            p.display_name AS displayName,
            p.description,
            u.image_url AS imageURL,
            u.city,
            u.state,
            u.facebook_username AS facebookUsername,
            u.twitter_username AS twitterUsername,
            u.youtube_username AS youtubeUsername
          FROM platforms AS p
          JOIN users AS u ON p.id=u.platform_id
          ORDER BY handle`
        );
        return result.rows;
      };


    static async getById(user) {
        const platformRes = await db.query(
            `SELECT *
            FROM platforms
            WHERE id=$1`,
            [user.platformid]
        );

        const platform = platformRes.rows[0];

        if(!platform) throw new NotFoundError(`No Platform With ID: ${user.id}`);

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

        return user;
    };

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
                                    image_url AS imageUrl,
                                    address_1 AS address1,
                                    address_2 AS address2,
                                    city, state, 
                                    postal_code AS postalCode,
                                    phone,
                                    twitter_username AS twitterUsername,
                                    facebook_username AS
                                    facebookUsername,
                                    youtube_username AS
                                    youtubeUsername`;
        const uResult = await db.query(userQuerySql, [...values, platformId]);
        const user = uResult.rows[0];
        return user;
      }
      const user = await updateUser();
      user.platformData = platform;
  
      return user;
    };

    static async remove(platformId) {
      const result = await db.query(
        `DELETE FROM users
        WHERE platform_id=$1
        RETURNING platform_id`,
        [platformId]
      );
      const platform = result.rows[0];
      if(!platform) throw new NotFoundError(`Platform: ${platformId} Not Found!`);
      return 'deleted';
    };

    static async getFollows(platformId, itemType) {
      if(itemType === "tag" || itemType === "writer") {
        const result = await db.query(
          `SELECT * FROM platform_${itemType}_follows AS f
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

      static async followItem(platformId, itemId, itemType) {
        if(itemType==="tag" || itemType==="writer") {

          //CHECK IF WRITER ALREADY FOLLOWS
          const duplicateCheck = await db.query(
            `SELECT * FROM platform_${itemType}_follows
            WHERE platform_id=$1 AND ${itemType}_id=$2`,
            [platformId, itemId]
          );
          if(duplicateCheck.rows[0]) throw new BadRequestError(`Platform: ${platformId} already follows ${itemType.toUpperCase()}: ${itemId}`); 


          const result = await db.query(
            `INSERT INTO platform_${itemType}_follows (platform_id, ${itemType}_id)
            VALUES($1, $2)
            RETURNING platform_id AS platformId,
            ${itemType}_id AS ${itemType}Id`,
            [platformId, itemId]
          );
          return result.rows[0];
        };

       throw new BadRequestError("Item Type must be String: 'tag' or 'writer'");
      };

      static async unfollowItem(platformId, itemId, itemType) {
        if(itemType==="tag" || itemType==="writer") {

          const result = await db.query(
            `DELETE FROM platform_${itemType}_follows
            WHERE ${itemType}_id=$1
            AND platform_id=$2
            RETURNING platform_id AS platformId,
            ${itemType}_id AS ${itemType}Id`,
            [itemId, platformId]
          );

          //CHECK TO SEE IF THEY EVEN FOLLOWED
          if(!result.rows[0]) throw new NotFoundError(`Platform: ${platformId} does not follow ${itemType.toUpperCase()}: ${itemId}`);

          return result.rows[0];
        };
        throw new BadRequestError("Item Type must be String: 'tag' or 'writer'");
      };
};

module.exports = Platform;