// GIG MODEL
const db = require("../db");
const {
    NotFoundError,
    BadRequestError
  } = require("../expressError");
const {checkForItem, getUserHelper, checkForFollow} = require('../helpers/checks');

class Gig {

    /**Returns a list of all gigs. */
    static async getAll() {
        const result = await db.query(
            `SELECT *
            FROM gigs`
        );
        return result.rows;
    };

    static async getById(id) {
        const gig = await checkForItem(id, 'gigs', 'id');
        if(!gig) throw new NotFoundError(`Gig: ${id} Not Found!`);
        return gig;
    };

    static async getByTagTitle(title) {
        const tag = await checkForItem(title, 'tags', 'title');
        if(!tag) throw new NotFoundError(`Tag: ${title} Not Found!`);
        const gigTags = await checkForItem(tag.id, 'gig_tags', 'tag_id', true);
        if(!gigTags.length) throw new NotFoundError(`Tag: ${title} Has No Gigs`);
        const gigs = await Promise.all(gigTags.map(gt => (
            checkForItem(gt.gig_id, 'gigs', 'id')
        )));
        return gigs;
    };

    static async getByPlatformId(platformId) {
        const platform = await checkForItem(platformId, 'users', 'id');
        if(!platform || !platform.platform_id) throw new NotFoundError(`Platform: ${platformId} Not Found!`);
        const gigs = await checkForItem(platform.platform_id, 'gigs', 'platform_id', true);
        if(!gigs.length) throw new NotFoundError(`Platform: ${platformId} has no gigs currently`);
        return gigs;
    }

    static async createGig(platformId, { title, description, compensation, isRemote, wordCount }) {
        const redundantGigCheck = await db.query(
            `SELECT *
            FROM gigs
            WHERE platform_id=$1
            AND title=$2`,
            [platformId, title]
        );
        if(redundantGigCheck.rows[0]) throw new BadRequestError(`Gig with title: ${title} already posted by Platform: ${platformId}`);

        const platfromResult = await db.query(
            `SELECT p.display_name
            FROM platforms AS p JOIN users AS u
            ON p.id=u.platform_id`
        );

        const result = await db.query(
            `INSERT INTO gigs (platform_id, title, description, compensation, is_remote, word_count)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING title, description, compensation, is_remote AS isRemote, word_count AS wordCount, is_active AS isActive`,
            [platformId, title, description, compensation, isRemote, wordCount]
        );
        const newGig = result.rows[0];
        newGig.platformName = platfromResult.rows[0];
        return newGig;
    }
};

//GET ALL GIGS

// CREATE GIG
// -INPUT: platform_name, title, description, compensation, is_remote, number_of_words, gig_type
// -SUCCESS: Returns gig data
// -LIMITATIONS: Create gig schema, ensureCorrectPlatformOrAdmin

// EDIT GIG:
// -INPUT: platform_name, title, description, compensation, is_remote, number_of_words, gig_type
// -SUCCESS: Returns gig data
// -FAILURE: errorNotFound
// -LIMITATIONS: Update gig schema, ensureCorrectPlatformOrAdmin

// REMOVE GIG:
// -INPUT: title
// -SUCESS: Returns undefined
// -FAILURE: errorNotFound
// -LIMITATIONS: ensureCorrectPlatformOrAdmin

// ADD TAG TO GIG
// -INPUT: gig_title, tag_title
// -Success returns gig and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin

// REMOVE TAG FROM GIG
// -INPUT: gig_title, tag_title
// -Success returns gig and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectPlatformOrAdmin

module.exports = Gig;