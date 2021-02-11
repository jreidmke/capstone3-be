// PLATFORM MODEL

"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

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