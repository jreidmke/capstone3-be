// PLATFORM MODEL

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

class Platform {
    static async getPlatformById(user) {
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
    }
};

module.exports = Platform;

// FIND ALL
// -Success returns all data on all companies

// GET PLATFORM
// -INPUT: platform_name
// -Success: Returns all data on platform except password
// -Failure: errorNotFound

// UPDATE PLATFORM
// -INPUT: platform_name, updatedData
// -Success returns updatedData
// -Failure throws not found error
// -LIMITATIONS: AGAIN!!! ALOT OF LIMITATIONS. ALOT OF LIMITATIONS! This could potentially allow people to become admins which is a huge security problem. ensureCorrectPlatformOrAdmin and update platform schema.

// REMOVE PLATFORM
// -INPUT: platform_name
// -Success returns undefined
// -Failure throws errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin