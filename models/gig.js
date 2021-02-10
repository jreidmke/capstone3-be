// GIG MODEL
const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
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
        let tags = await checkForItem(gig.id, 'gig_tags', 'gig_id', true);
        tags = await Promise.all(tags.map(t => (
            checkForItem(t.tag_id, 'tags', 'id')
        )))
        gig.tags = tags;
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
        const platfromResult = await db.query(
            `SELECT p.id, p.display_name
            FROM platforms AS p JOIN users AS u
            ON p.id=u.platform_id
            WHERE u.id=$1`,
            [platformId]
        );

        const platform = platfromResult.rows[0];

        const redundantGigCheck = await db.query(
            `SELECT *
            FROM gigs
            WHERE platform_id=$1
            AND title=$2`,
            [platform.id, title]
        );
        if(redundantGigCheck.rows[0]) throw new BadRequestError(`Gig with title: ${title} already posted by Platform: ${platform.id}`);

        const result = await db.query(
            `INSERT INTO gigs (platform_id, title, description, compensation, is_remote, word_count)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING title, description, compensation, is_remote AS isRemote, word_count AS wordCount, is_active AS isActive`,
            [platform.id, title, description, compensation, isRemote, wordCount]
        );
        const newGig = result.rows[0];
        newGig.platformName = platform.display_name;
        return newGig;
    };

    static async removeGig(platformId, gigId) {
        const platform = await getUserHelper(platformId);
        const gig = await checkForItem(gigId, 'gigs', 'id');
        if(!platform || !gig) throw new NotFoundError('Can\'t find resource');
        if(platform.platform_id !== gig.platform_id) throw new UnauthorizedError();
        await db.query(
            `DELETE FROM gigs
            WHERE id=$1`,
            [gigId]
        );
        return 'deleted';
    };
};

//GET ALL GIGS

module.exports = Gig;