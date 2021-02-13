// GIG MODEL
const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
  } = require("../expressError");
const {checkForItem} = require('../helpers/checks');
const {sqlForPartialUpdate} = require("./../helpers/sql");

class Gig {

    /** Find all gigs (optional filter on searchFilters).
     *
     * searchFilters (all optional):
     * - compensation
     * - maxWordCount
     * - minWordCount
     * - isRemote
     * - platformId
     * - tagTitle
     *
     * Returns [{ id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at }, ...]
     * */

     static async getAll(searchFilters = {}) {
        let query = `SELECT * FROM gigs`;
        let whereExpressions = [];
        let queryValues = [];

        const { compensation, maxWordCount, minWordCount, isRemote, platformId, tagTitle } = searchFilters;

        if(minWordCount > maxWordCount) throw new BadRequestError("Min word count cannot be greater than max");

        if(compensation !== undefined) {
            queryValues.push(compensation);
            whereExpressions.push(`compensation >= $${queryValues.length}`);
        };

        if(maxWordCount !== undefined) {
            queryValues.push(maxWordCount);
            whereExpressions.push(`word_count <= $${queryValues.length}`);
        };

        if(minWordCount !== undefined) {
            queryValues.push(minWordCount);
            whereExpressions.push(`word_count >= $${queryValues.length}`);
        };

        if(isRemote !== undefined) {
            queryValues.push(isRemote);
            whereExpressions.push(`is_remote=$${queryValues.length}`);
        };

        if(platformId !== undefined) {
            queryValues.push(platformId);
            whereExpressions.push(`platform_id=$${queryValues.length}`); 
        };

        if(whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        };

        if(tagTitle !== undefined) {
            const tagRes = await db.query(
                `SELECT gt.gig_id FROM tags AS t
                JOIN gig_tags AS gt
                ON t.id = gt.tag_id
                WHERE title LIKE '%${tagTitle}%'`
            );
            let tags = tagRes.rows.map(t => parseInt(t.gig_id));
            if(!whereExpressions.length) {
                query += ` WHERE id IN (${tags.join(',')})`;
            } else {
                query += ` AND id IN (${tags.join(',')})`
            };
        };

        const gigRes = await db.query(query, queryValues);
        return gigRes.rows;
    };

    /** Given a gig id, returns data about gig
     * 
     * Returns { id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at, tags }
     *  where tags is [{id, title, is_fiction},...]
     * 
     * Throws NotFoundError
     */

    static async getById(id) {
        const gig = await checkForItem(id, 'gigs', 'id');
        if(!gig) throw new NotFoundError(`Gig: ${id} Not Found!`);

        const tagRes = await db.query(
            `SELECT t.*
            FROM tags AS t
            JOIN gig_tags AS gt
            ON gt.tag_id=t.id
            WHERE gt.gig_id=$1`,
            [gig.id]
        );
        gig.tags = tagRes.rows;
        return gig;
    };

    /** Create a gig (from data), update db, return new gig data.
   *
   * data should be { id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at }
   *
   * Returns the same
   *
   * Throws BadRequestError if gig already in database.
   * */

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

    /** Update gig data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at }
   *
   * Returns { id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at }
   *
   * Throws NotFoundError if not found.
   */

    static async update(platformId, gigId, data) {
        const authCheck = await db.query(
          `SELECT * FROM gigs WHERE id=$1`,
          [gigId]
        );
    
        if(authCheck.rows[0].platform_id !== platformId) throw new UnauthorizedError();
    
        let { setCols, values } = sqlForPartialUpdate(data, {
            isRemote: "is_remote",
            wordCount: "word_count",
            isActive: "is_active"
        });

        const gigIdVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE gigs 
                          SET ${setCols} 
                          WHERE id = ${gigIdVarIdx} 
                          RETURNING *`;
    
        const result = await db.query(querySql, [...values, gigId]);
        const gig = result.rows[0];
    
        if (!gig) throw new NotFoundError(`No writer: ${gig}`);
       
        return gig;
    };

    /** Delete given company from database; returns undefined.
    *
    * Throws NotFoundError if company not found.
    **/

    static async removeGig(platformId, gigId) {
        const authCheck = await db.query(
            `SELECT platform_id FROM gigs WHERE id=$1`, [gigId]
        );
        
        if(!authCheck.rows[0]) throw new NotFoundError(`Gig: ${gigId} Not Found`);
        if(platformId !== authCheck.rows[0].platform_id) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM gigs
            WHERE id=$1
            RETURNING *`,
            [gigId]
        );
        return result.rows[0];
    };

    /**Adds tag to gig (from gigId and tagId). Uses Platform Id to verify ownership of gig
     * 
     * Returns {newTag: {tagId, gigId}}
     * 
     * Failure throws unauthorized
     */

    static async addTagToGig(platformId, gigId, tagId) {
        const authCheck = await db.query(
            `SELECT platform_id FROM gigs WHERE id=$1`, [gigId]
        );

        if(!authCheck.rows[0]) throw new NotFoundError(`Gig: ${gigId} Not Found`);
        if(platformId !== authCheck.rows[0].platform_id) throw new UnauthorizedError();

        const result = await db.query(
            `INSERT INTO gig_tags (gig_id, tag_id)
            VALUES ($1, $2)
            RETURNING gig_id AS gigId, tag_id AS tagId`,
            [gigId, tagId]
        ); 
        return result.rows[0];
    };

    /**Removes tag from gig (from gigId and tagId). Uses Platform Id to verify ownership of gig
     * 
     * Returns {removedTag: {tagId, gigId}}
     * 
     * Failure throws unauthorized
     */

    static async removeTagFromGig(platformId, gigId, tagId) {
        const authCheck = await db.query(
            `SELECT platform_id FROM gigs WHERE id=$1`, [gigId]
        );
        
        if(!authCheck.rows[0]) throw new NotFoundError(`Gig: ${gigId} Not Found`);
        if(platformId !== authCheck.rows[0].platform_id) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM gig_tags
            WHERE gig_id=$1
            AND tag_id=$2
            RETURNING gig_id AS gigId,
            tag_id AS tagId`,
            [gigId, tagId]
        );
        return result.rows[0];
    };
};

//GET ALL GIGS

module.exports = Gig;