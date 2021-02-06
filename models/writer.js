// WRITER MODEL METHODS

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Writer {

     /** AUTHENTICATE WRITER
    Success: {username, password} => {username, is_admin}
    Failure throws UnauthorizedError.
    Works in tandem with /writers/login route to create JWT used to make further requests.
    */

    static async authenticate(username, password) {
        const result = await db.query(
                `SELECT username, password, is_admin
                FROM writers
                WHERE username=$1`,
                [username]
        );

        const user = result.rows[0];

        if(user) {
          const validPassword = await bcrypt.compare(password, user.password);
          if(validPassword === true) {
            delete user.password;
            return user;
          };
        };
        throw new UnauthorizedError('Invaid username/password');
    }; 

    /**REGISTER WRITER
     * Success: ALL WRITER PROPERTIES except bio & is_admin => { username, isAdmin }
     * Failure throws BadRequestError
     * Works in tandem with /writers/register to create JWT to make further reqs. 
     */

    static async register({username, password, firstName, lastName, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin}) {
      const duplicateCheck = await db.query(
        `SELECT username
        FROM writers
        WHERE username = $1`,
        [username]
      );

      if(duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }; 

      const hashWord = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      const result = await db.query(
        `INSERT INTO writers(
          username,
          password,
          first_name,
          last_name,
          age,
          location,
          email,
          phone,
          twitter_username,
          facebook_username,
          youtube_username,
          is_admin
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING username, is_admin AS isAdmin`, 
        [username, hashWord, firstName, lastName, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, isAdmin]
      );

      const user = result.rows[0];

      return user;
    }; 

    /**FIND ALL WRITERS
     * 
     * Returns [{username, first_name, last_name, image_url, location}, ...]
     */

    static async getAll() {
      const result = await db.query(
        `SELECT username,
          first_name AS firstName,
          last_name AS lastName,
          image_url AS imageUrl,
          location
        FROM writers
        ORDER BY username`
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

     static async getByUsername(username) {
       const result = await db.query(
         `SELECT username,
            first_name AS firstName,
            last_name AS lastName,
            image_url AS imageUrl,
            location,
            email,
            phone,
            twitter_username AS twitterUsername,
            facebook_username AS facebookUsername,
            youtube_username AS youtubeUsername
          FROM writers
          WHERE username=$1`,
          [username]
       );

       const writer = result.rows[0];

       if(!writer) throw new NotFoundError(`No User: ${username}`);

       const portfolioRes = await db.query(
         `SELECT * FROM portfolios WHERE writer_username=$1`,
         [username]
       );
       writer.portfolios = portfolioRes.rows.map(p => ({id: p.id, title: p.title, writer_username: p.writer_username}));
       return writer;
     }

};

module.exports = Writer;

// FIND ALL
// -Success returns all data on all writers (except their password, as well as followed tags and followed platforms)

// GET WRITER
// -Input: username
// -Success returns all data on writer except password, all portfolios, pieces, applications, followed tags, and followed platforms.
// -Failure throws BadRequestError
// Limitations: ensureCorrectUserOrAdmin 

// UPDATE WRITER
// -Input: username <=this is not changable! this is just for verification, password, first_name, last_name, age, location, email, phone, twitter_url, youtube_url, facebook_url
// -Success returns all data on writer except password
// -Failure Throws NotFoundError
// Limitations: ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectUserOrAdmin and update writer schema. 

// REMOVE WRITER
// -Input: username, password
// -Success returns undefined. 
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin

// FOLLOW TAG
// -Input: Username, tag title
// -Success returns username, tagtitle
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin, json schema for follow tag

// FOLLOW PLATFORM
// -Input: Username, platform name
// -Success returns username, platformname
// -Failure throws NotFoundError.
// Limitations: ensureCorrectUserOrAdmin, json schema for follow platform.