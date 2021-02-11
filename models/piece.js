const db = require("../db");
const {
  NotFoundError, 
  UnauthorizedError,
  BadRequestError
} = require("../expressError");

class Piece {
    static async getAllByWriterId(writerId) {
        const result = await db.query(
            `SELECT * FROM pieces
            WHERE writer_id=$1`,
            [writerId]
        );
        const pieces = result.rows;

        //Error Handling
        if(!pieces.length) throw new NotFoundError(`Writer: ${writerId} Has No Pieces Posted`);

        return pieces;
    };

    static async getById(pieceId) {
        const result = await db.query(
            `SELECT * FROM pieces
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

    static async create(writerId, title, text) {
        const result = await db.query(
            `INSERT INTO pieces (writer_id, title, text)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [writerId, title, text]
        );
        const piece = result.rows[0];
        return piece;
    };

    static async remove(writerId, pieceId) {
        const authCheck = await db.query(
            `SELECT * FROM pieces WHERE id=$1`,
            [pieceId]
        );

        //Error Handling
        if(!authCheck.rows[0]) throw new NotFoundError(`Piece: ${pieceId} Not Found!`);
        if(authCheck.rows[0].writer_id !== writerId) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM pieces
            WHERE id=$1
            RETURNING *`,
            [pieceId]
        );
        return result.rows[0];
    };

    static async addPieceToItem(writerId, pieceId, itemId, itemType) {
        if(itemType === "portfolio" || itemType === "tag") {

            //ERROR HANDLING
            const dupCheck = await db.query(
                `SELECT * from piece_${itemType}s
                WHERE piece_id=$1
                AND ${itemType}_id=$2`,
                [pieceId, itemId]
            );
            if(dupCheck.rows[0]) throw new NotFoundError(`Piece: ${pieceId} is already added to ${itemType.toUpperCase()}: ${itemId}!`);
            
            const authCheck = await db.query(
                `SELECT writer_id 
                FROM pieces
                WHERE id=$1`,
                [pieceId]
            );
            if(authCheck.rows[0].writer_id !== writerId) throw new UnauthorizedError();

            //INSERT STATEMENT
            const result = await db.query(
                `INSERT INTO piece_${itemType}s (piece_id, ${itemType}_id)
                VALUES($1, $2)
                RETURNING piece_id AS pieceId,
                ${itemType}_id AS ${itemType}Id`,
                [pieceId, itemId]
            ); 
            return result.rows[0];
        };
       throw new BadRequestError("Item Type must be String: 'tag' or 'portfolio'");
    };

    static async removePieceFromItem(writerId, pieceId, itemId, itemType) {
        if(itemType === "portfolio" || itemType === "tag") {
            const dupCheck = await db.query(
                `SELECT * from piece_${itemType}s
                WHERE piece_id=$1
                AND ${itemType}_id=$2`,
                [pieceId, itemId]
            );
            if(!dupCheck.rows[0]) throw new NotFoundError(`Piece: ${pieceId} is not added to ${itemType.toUpperCase()}: ${itemId}!`);
            
            const authCheck = await db.query(
                `SELECT writer_id 
                FROM pieces
                WHERE id=$1`,
                [pieceId]
            );
            if(authCheck.rows[0].writer_id !== writerId) throw new UnauthorizedError();

            //DELETE STATEMENT
            const result = await db.query(
                `DELETE FROM piece_${itemType}s
                WHERE piece_id=$1
                AND ${itemType}_id=$2
                RETURNING piece_id AS pieceId,
                ${itemType}_id AS ${itemType}Id`,
                [pieceId, itemId]
            );
            return result.rows[0];
        };
    };

};

module.exports = Piece;