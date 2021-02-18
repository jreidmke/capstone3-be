const db = require("../db");
const {
  NotFoundError, 
  UnauthorizedError,
  BadRequestError
} = require("../expressError");
const { sqlForPartialUpdate } = require('./../helpers/sql');

class Piece {

    /**Given a writer id, returns all pieces by writer
     * 
     * Returns [{id, writer_id, title, text, created_at, updated_at},...]
     */
    static async getAllByWriterId(writerId) {
        const result = await db.query(
            `SELECT id, writer_id AS "writerId", title, text, created_at AS "createdAt", updated_at AS "updatedAt"
            FROM pieces
            WHERE writer_id=$1`,
            [writerId]
        );
        const pieces = result.rows;
        if(!pieces.length) throw new NotFoundError(`Writer: ${writerId} Not Found!`);
        return pieces;
    };

    /**Given a piece id, returns a piece
     * 
     * Returns {id, writer_id, title, text, created_at, updated_at, tags}
     *  where tags {id, title}
     * 
     * Failure throws not found
     */
    
    static async getById(pieceId) {
        const result = await db.query(
            `SELECT id, writer_id AS "writerId", title, text, created_at AS "createdAt", updated_at AS "updatedAt" 
            FROM pieces
            WHERE id=$1`,
            [pieceId]
        );
        const piece = result.rows[0];

        //Error Handling
        if(!piece) throw new NotFoundError(`Piece: ${pieceId} Not Found!`);

        const tagRes = await db.query(
            `SELECT t.title, t.id FROM piece_tags AS pt
            JOIN tags AS t
            ON pt.tag_id=t.id
            WHERE pt.piece_id=$1`,
            [piece.id]
        );
        piece.tags = tagRes.rows;

        return piece;
    };

   /** Create a piece (from data), update db, return new gig data.
   *
   * data should be { writerId, title, text }
   *
   * Returns the same
   * */

    static async create(writerId, title, text) {
        const result = await db.query(
            `INSERT INTO pieces (writer_id, title, text)
            VALUES ($1, $2, $3)
            RETURNING id, writer_id AS "writerId", title, text, created_at AS "createdAt"`,
            [writerId, title, text]
        );
        const piece = result.rows[0];
        return piece;
    };

    /** Update piece data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { title, text }
   *
   * Returns { title, text, created_at, updated_at }
   *
   * Throws NotFoundError if not found.
   */

    static async update(writerId, pieceId, data) {
        const authCheck = await db.query(
          `SELECT * FROM pieces WHERE id=$1`,
          [pieceId]
        );
    
        if(authCheck.rows[0].writer_id !== parseInt(writerId)) throw new UnauthorizedError();
    
        let { setCols, values } = sqlForPartialUpdate(data, {});
        const pieceIdVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE pieces 
                          SET ${setCols} 
                          WHERE id = ${pieceIdVarIdx} 
                          RETURNING  id, writer_id AS "writerId", title, text, created_at AS "createdAt", updated_at AS "updatedAt"`;
    
        const result = await db.query(querySql, [...values, pieceId]);
        const piece = result.rows[0];
    
        if (!piece) throw new NotFoundError(`No piece: ${pieceId}`);
       
        return piece;
    };

    /** Delete given piece from database; returns all data on deleted piece.
    *
    * Throws NotFoundError if piece not found, UnauthorizedError is piece does not belong to writer.
    **/
    
    static async remove(writerId, pieceId) {
        const authCheck = await db.query(
            `SELECT * FROM pieces WHERE id=$1`,
            [pieceId]
        );

        //Error Handling
        if(!authCheck.rows[0]) throw new NotFoundError(`Piece: ${pieceId} Not Found!`);
        if(authCheck.rows[0].writer_id !== parseInt(writerId)) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM pieces
            WHERE id=$1
            RETURNING *`,
            [pieceId]
        );
        return result.rows[0];
    };

    /**Adds tag to piece OR piece to portfolio (from pieceId and tagId/portfolioId). Uses Writer Id to verify ownership of piece
     * 
     * Returns {new: {tagId, pieceId}} OR {new: {pieceId, portfolioId}}
     * 
     * Failure throws unauthorized
     */

    static async addPieceToItem(writerId, pieceId, itemId, itemType) {
        if(itemType === "portfolio" || itemType === "tag") {           
            const authCheck = await db.query(
                `SELECT writer_id 
                FROM pieces
                WHERE id=$1`,
                [pieceId]
            );

            if(authCheck.rows[0].writer_id != writerId) throw new UnauthorizedError();

            //INSERT STATEMENT
            const result = await db.query(
                `INSERT INTO piece_${itemType}s (piece_id, ${itemType}_id)
                VALUES($1, $2)
                RETURNING piece_id AS "pieceId",
                ${itemType}_id AS "${itemType}Id"`,
                [pieceId, itemId]
            ); 
            return result.rows[0];
        };
       throw new BadRequestError("Item Type must be String: 'tag' or 'portfolio'");
    };

    /**Removes tag from piece OR piece from portfolio (from pieceId and tagId/portfolioId). Uses Writer Id to verify ownership of piece
     * 
     * Returns {removed: {tagId, pieceId}} OR {removed: {pieceId, portfolioId}}
     * 
     * Failure throws unauthorized
     */

    static async removePieceFromItem(writerId, pieceId, itemId, itemType) {
        if(itemType === "portfolio" || itemType === "tag") {
            const authCheck = await db.query(
                `SELECT writer_id 
                FROM pieces
                WHERE id=$1`,
                [pieceId]
            );
            if(authCheck.rows[0].writer_id !== parseInt(writerId)) throw new UnauthorizedError();

            //DELETE STATEMENT
            const result = await db.query(
                `DELETE FROM piece_${itemType}s
                WHERE piece_id=$1
                AND ${itemType}_id=$2
                RETURNING piece_id AS "pieceId",
                ${itemType}_id AS "${itemType}Id"`,
                [pieceId, itemId]
            );
            return result.rows[0];
        };
    };

};

module.exports = Piece;