// PIECE MODEL
const db = require("../db");
const { getUserHelper, checkForItem } = require("../helpers/checks");
const {
  NotFoundError,
  UnauthorizedError,
} = require("../expressError");

class Piece {
    static async getAll(userId) {
        const user = await getUserHelper(userId);
        const pieces = await checkForItem(user.writer_id, 'pieces', 'writer_id', true);
        if(!pieces.length) throw new NotFoundError(`User: ${userId} Has No Pieces`);
        return pieces;
    };

    static async getById(userId, pieceId) {
        const user = await getUserHelper(userId);
        const piece = await checkForItem(pieceId, 'pieces', 'id');
        if(!piece) throw new NotFoundError(`Piece with ID: ${id} Not Found!`);
        if(user.writer_id !== piece.writer_id) throw new UnauthorizedError();
        return piece;
    };

    static async createPiece(userId, title, text) {
        const user = await getUserHelper(userId);
        const result = await db.query(
            `INSERT INTO pieces (writer_id, title, text)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [user.writer_id, title, text]
        );
        const piece = result.rows[0];
        return piece;
    };

    static async removePiece(userId, pieceId) {
        const user = await getUserHelper(userId);
        const piece = await checkForItem(pieceId, 'pieces', 'id');
        if(!piece) throw new NotFoundError(`Piece with ID: ${id} Not Found!`);
        if(user.writer_id !== piece.writer_id) throw new UnauthorizedError();
        await db.query(
            `DELETE FROM pieces
            WHERE id=$1`,
            [pieceId]
        )
    }
}

module.exports = Piece;
// CREATE PIECE:
// -INPUT: username, title, text
// -Success returns title and text
// -Limitations: now piece schema, ensureCorrectUserOrAdmin

// EDIT PIECE:
// -INPUT: title, new title, new text
// -Success returns new title and new text
// -Failure returns not found error
// -Limitations: update piece schema, ensureCorrectUserOrAdmin

// REMOVE PIECE:
// -INPUT: title
// -Success returns undefined
// -Failure returns not found error
// -Limitations: ensureCorrectUserOrAdmin

// ADD TAG TO PIECE:
// -INPUT: piece_title, tag_title
// -Success returns piece and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectUserOrAdmin

// REMOVE TAG FROM PIECE:
// -INPUT: piece_title, tag_title
// -Success returns piece and list of tags
// -Failure returns errorNotFound
// -Limitations: ensureCorrectUserOrAdmin

// GET PIECES BY TAG
// -INPUT: tag_title
// -Sucess: returns all pieces that contain tag
// -Failure: errorNotFound
// -Limitations: tag schema