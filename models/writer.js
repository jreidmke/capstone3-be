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

     static async getById(user) {
        const writerRes = await db.query(
          `SELECT *
          FROM writers
          WHERE id=$1`,
          [user.writerid]
        );

        const writer = writerRes.rows[0];

        if(!writer) throw new NotFoundError(`No Writer With ID: ${user.id}`);

        user.firstName = writer.first_name;
        user.lastName = writer.last_name;
        user.age = writer.age;
        user.bio = writer.bio;
        user.createdAt = writer.created_at;

        const portfolioRes = await db.query(
            `SELECT * FROM portfolios WHERE writer_id=$1`,
            [writer.id]
        );
        user.portfolios = portfolioRes.rows.map(p => ({id: p.id, title: p.title}));

        return user;
     };

     // UPDATE WRITER
    // -Input: username <=this is not changable! this is just for verification, password, first_name, last_name, age, location, email, phone, twitter_url, youtube_url, facebook_url
    // -Success returns all data on writer except password
    // -Failure Throws NotFoundError
    // Limitations: ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectUserOrAdmin and update writer schema.
};

module.exports = Writer;