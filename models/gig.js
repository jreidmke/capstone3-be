// GIG MODEL
const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
  } = require("../expressError");
const {sqlForPartialUpdate} = require("./../helpers/sql");

class Gig {

    /** Find all gigs (optional filter on searchFilters).
     *
     * searchFilters (all optional):
     * - minCompensation
     * - maxWordCount
     * - minWordCount
     * - isRemote
     * - platformId
     * - tagTitle
     *
     * Returns [{ id, platfrom_id, title, description, compensation, is_remote, word_count, is_active, created_at, updated_at }, ...]
     * */

     static async getAll(searchFilters = {}) {
        let query = `SELECT gigs.id, 
                            gigs.platform_id AS "platformId", 
                            title, 
                            gigs.description, 
                            compensation, 
                            is_remote AS "isRemote", 
                            word_count AS "wordCount", 
                            is_active AS "isActive",
                            image_url AS "imageUrl",
                            platforms.display_name AS "displayName"
                    FROM gigs
                    JOIN users
                    ON gigs.platform_id=users.platform_id
                    JOIN platforms
                    ON gigs.platform_id=platforms.id`;

        let whereExpressions = [];
        let queryValues = [];

        const { minCompensation, maxWordCount, minWordCount, isRemote, platformId, tagTitle } = searchFilters;

        if(minWordCount > maxWordCount) throw new BadRequestError("Min word count cannot be greater than max");

        if(minCompensation !== undefined && minCompensation !== "") {
            queryValues.push(minCompensation);
            whereExpressions.push(`compensation >= $${queryValues.length}`);
        };

        if(maxWordCount !== undefined && maxWordCount !== "") {
            queryValues.push(maxWordCount);
            whereExpressions.push(`word_count <= $${queryValues.length}`);
        };

        if(minWordCount !== undefined && minWordCount !== "") {
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
            if(!tags.length) throw new NotFoundError(`No Tags Match Tag: ${tagTitle}`)
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
        const result = await db.query(
            `SELECT g.id, 
                    g.platform_id AS "platformId", 
                    g.title, 
                    g.created_at AS "createdAt",
                    g.description, 
                    g.compensation, 
                    g.is_remote AS "isRemote", 
                    g.word_count AS "wordCount", 
                    g.is_active AS "isActive", 
                    p.display_name AS "displayName"
            FROM gigs AS g
            JOIN platforms AS p
            ON p.id=platform_id
            WHERE g.id=$1`,
            [id]
        );
        const gig = result.rows[0];
        if(!gig) throw new NotFoundError(`Gig: ${id} Not Found!`);

        const tagRes = await db.query(
            `SELECT t.title, t.id
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
            RETURNING id, platform_id AS "platformId", title, description, compensation, is_remote AS "isRemote", word_count AS "wordCount", is_active AS "isActive"`,
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

        if(!authCheck.rows[0]) throw new NotFoundError(`Gig: ${gigId} Not Found!`);
        if(authCheck.rows[0].platform_id != platformId) throw new UnauthorizedError();
    
        let { setCols, values } = sqlForPartialUpdate(data, {
            isRemote: "is_remote",
            wordCount: "word_count",
            isActive: "is_active"
        });

        const gigIdVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE gigs 
                          SET ${setCols} 
                          WHERE id = ${gigIdVarIdx} 
                          RETURNING compensation, 
                                    created_at AS "createdAt",
                                    description,
                                    id,
                                    is_active AS "isActive",
                                    is_remote AS "isRemote",
                                    platform_id AS "platformId",
                                    title,
                                    updated_at AS "updatedAt",
                                    word_count AS "wordCount"`;
    
        const result = await db.query(querySql, [...values, gigId]);
        const gig = result.rows[0];
    
        if (!gig) throw new NotFoundError(`No writer: ${gig}`);
       
        return gig;
    };

    /** Delete given gig from database; returns all data on deleted gig.
    *
    * Throws NotFoundError if gig not found, UnauthorizedError is gig does not belong to platform.
    **/

    static async removeGig(platformId, gigId) {
        const authCheck = await db.query(
            `SELECT platform_id FROM gigs WHERE id=$1`, [gigId]
        );
        
        if(!authCheck.rows[0]) throw new NotFoundError(`Gig: ${gigId} Not Found`);
        if(parseInt(platformId) !== authCheck.rows[0].platform_id) throw new UnauthorizedError();

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
        if(parseInt(platformId) !== authCheck.rows[0].platform_id) throw new UnauthorizedError();

        const result = await db.query(
            `INSERT INTO gig_tags (gig_id, tag_id)
            VALUES ($1, $2)
            RETURNING gig_id AS "gigId", tag_id AS "tagId"`,
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
        if(platformId != authCheck.rows[0].platform_id) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM gig_tags
            WHERE gig_id=$1
            AND tag_id=$2
            RETURNING gig_id AS "gigId",
            tag_id AS "tagId"`,
            [gigId, tagId]
        );
        return result.rows[0];
    };


    static async getRelatedPieces(tagIds) {
        const result = await db.query(
            `SELECT p.id,
                    p.writer_id AS "writerId",
                    p.title AS "pieceTitle",
                    p.text,
                    p.created_at AS "createdAt",
                    w.first_name AS "firstName",
                    w.last_name AS "lastName",
                    u.image_url AS "imageUrl",
                    t.title as "tagTitle"
            FROM pieces AS p
            JOIN writers AS w
            ON p.writer_id=w.id
            JOIN users AS u
            ON p.writer_id=u.writer_id
            JOIN piece_tags AS pt
            ON pt.piece_id=p.id
            JOIN tags AS t
            ON pt.tag_id=t.id
            WHERE t.id IN (${tagIds})
            ORDER BY p.created_at`
        );
        return result.rows;
    };

    //**OFFER STUFF */

    static async makeQuery(platformId, gigId, writerId, message) {
        const authCheck = await db.query(
            `SELECT platform_id FROM gigs where id=$1`, [gigId]
        );
        if(authCheck.rows[0].platform_id !== +platformId) throw new UnauthorizedError();

        const result = await db.query(
            `INSERT INTO queries(writer_id, platform_id, gig_id, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id,
                      writer_id AS "writerId",
                      platform_id AS "platformId",
                      gig_id AS "gigId",
                      created_at AS "createdAt",
                      message`,
            [writerId, platformId, gigId, message]
        );
        return result.rows[0];
    };

    // static async revokeOffer(offerId) {
    //     let result = await db.query(`DELETE FROM offers WHERE id=$1 RETURNING *`, [offerId]);
    //     return result.rows[0];
    // };
};


module.exports = Gig;