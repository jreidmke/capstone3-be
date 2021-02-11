const db = require("../db");
const {
  NotFoundError, 
  UnauthorizedError
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
};

module.exports = Piece;