// PLATFORM MODEL

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

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
    }
};

module.exports = Platform;