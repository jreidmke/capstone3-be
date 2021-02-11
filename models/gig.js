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
        const gigs = await checkForItem(platformId, 'gigs', 'platform_id', true);
        if(!gigs.length) throw new NotFoundError(`Platform: ${platformId} has no gigs currently`);
        return gigs;
    };

    static async createGig(platformId, { title, description, compensation, isRemote, wordCount }) {
        const redundantGigCheck = await db.query(
            `SELECT *
            FROM gigs
            WHERE platform_id=$1
            AND title=$2`,
            [platformId, title]
        );
        if(redundantGigCheck.rows[0]) throw new BadRequestError(`Gig with title: ${title} already posted by Platform: ${platformId}`);

        const result = await db.query(
            `INSERT INTO gigs (platform_id, title, description, compensation, is_remote, word_count)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING title, description, compensation, is_remote AS isRemote, word_count AS wordCount, is_active AS isActive`,
            [platformId, title, description, compensation, isRemote, wordCount]
        );
        
        const newGig = result.rows[0];
        return newGig;
    };

    static async removeGig(platformId, gigId) {
        const gig = await checkForItem(gigId, 'gigs', 'id');
        if(!gig) throw new NotFoundError('Can\'t find resource');
        if(platformId !== gig.platform_id) throw new UnauthorizedError();
        await db.query(
            `DELETE FROM gigs
            WHERE id=$1`,
            [gigId]
        );
        return 'deleted';
    };

    static async addTagToGig(platformId, gigId, tagId) {
        const gig = await checkForItem(gigId, 'gigs', 'id');
        const tag = await checkForItem(tagId, 'tags', 'id');
        if(!gig || !tag) throw new NotFoundError('Can\'t find resource');
        if(platformId !== gig.platform_id) throw new UnauthorizedError();
        const result = await db.query(
            `INSERT INTO gig_tags (gig_id, tag_id)
            VALUES ($1, $2)
            RETURNING gig_id AS gigId, tag_id AS tagId`,
            [gigId, tagId]
        ); 
        return result.rows[0];
    };

    static async removeTagFromGig(platformId, gigId, tagId) {
        const gig = await checkForItem(gigId, 'gigs', 'id');
        const tag = await checkForItem(tagId, 'tags', 'id');
        if(!gig || !tag) throw new NotFoundError('Can\'t find resource');
        if(platformId !== gig.platform_id) throw new UnauthorizedError();
        await db.query(
            `DELETE FROM gig_tags
            WHERE gig_id=$1
            AND tag_id=$2`,
            [gigId, tagId]
        );
        return 'deleted';
    }
};

//GET ALL GIGS

module.exports = Gig;