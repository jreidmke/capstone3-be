const db = require("../db");
const { getUserHelper, checkForItem, checkForPieceItem } = require("../helpers/checks");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError
} = require("../expressError");

/**CLASS CONTAINS MODELS FOR PORTFOLIO AND PIECES */

class WriterUpload {

    /**RETURNS either ALL PIECES by user or ALL PORTFOLIOS by user */

    static async getAll(userId, itemType) {
        if(itemType==="piece" || itemType==="portfolio") {
            const user = await getUserHelper(userId);
            const items = await checkForItem(user.writer_id, `${itemType}s`, 'writer_id', true);
            if(!items.length) throw new NotFoundError(`User: ${userId} Has No ${itemType}s`);
            return items;
        }
        throw new BadRequestError('Item Type must be string: "portfolio" or "piece"');
    };

    /**RETURNS ALL DATA on selected ITEM.
     *
     * If itemType="piece", returns related piece_tags.
     *
     * If itemType="portfolio", returns related portfolio_pieces.
     * */

    static async getById(userId, itemId, itemType) {
        if(itemType==="piece" || itemType==="portfolio") {
            const user = await getUserHelper(userId);
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(!item) throw new NotFoundError(`${itemType} with ID: ${itemId} Not Found!`);
            if(user.writer_id !== item.writer_id) throw new UnauthorizedError();
            if(itemType==="piece") {
                let tags = await checkForItem(itemId, 'piece_tags', 'piece_id', true);
                tags = await Promise.all(tags.map(t =>
                    checkForItem(t.tag_id, 'tags', 'id')
                ));
                item.tags=tags;
            } else {
                let pieces = await checkForItem(itemId, 'piece_portfolios', 'portfolio_id', true);
                pieces = await Promise.all(pieces.map(p => (
                    checkForItem(p.piece_id, 'pieces', 'id')
                )))
                item.pieces = pieces;
            }
            return item;
        };
        throw new BadRequestError('Item Type must be string: "portfolio" or "piece"');
    };

    static async remove(userId, itemId, itemType) {
        if(itemType==="piece" || itemType==="portfolio") {
            const user = await getUserHelper(userId);
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(!item) throw new NotFoundError(`${itemType} with ID: ${itemId} Not Found!`);
            if(user.writer_id !== item.writer_id) throw new UnauthorizedError();
            await db.query(
                `DELETE FROM ${itemType}s
                WHERE id=$1`,
                [itemId]
            );
            return "deleted";
        };
        throw new BadRequestError('Item Type must be string: "portfolio" or "piece"');
    };

    static async createPortfolio(userId, title) {
        const user = await getUserHelper(userId);
        const result = await db.query(
            `INSERT INTO portfolios (writer_id, title)
            VALUES ($1, $2)
            RETURNING title`,
            [user.writer_id, title]
        );
        const portfolio = result.rows[0];
        return portfolio;
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

    /**Used to ADD or REMOVE the connections between pieces and tags or pieces and portfolios */

    static async addOrRemovePieceItem(userId, pieceId, itemId, itemType, action) {
        if(itemType==="tag" || itemType==="portfolio" && action==="add" || action==="remove") {

            //CHECK TO MAKE SURE PIECE AND PORTFOLIO BELONG TO WRITER
            const user = await getUserHelper(userId);
            const piece = await checkForItem(pieceId, 'pieces', 'id');
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(user.writer_id !== piece.writer_id) throw new UnauthorizedError();
            if(itemType==="portfolio") {
                if(user.writer_id !== item.writer_id) throw new UnauthorizedError();
            };
            const redundantAddCheck = await checkForPieceItem(pieceId, itemId, itemType);

            if(action==="add") {
                if(redundantAddCheck) throw new BadRequestError(`Piece: ${pieceId} already added to ${itemType}: ${itemId}`);
                const result = await db.query(
                    `INSERT INTO piece_${itemType}s (piece_id, ${itemType}_id)
                    VALUES ($1, $2)
                    RETURNING piece_id AS pieceId,
                    ${itemType}_id AS ${itemType}Id`,
                    [pieceId, itemId]
                    );
                    return result.rows[0];
            } else {
                if(!redundantAddCheck) throw new BadRequestError(`Piece: ${pieceId} is not added to ${itemType}: ${itemId}`);
                await db.query(
                    `DELETE FROM piece_${itemType}s
                    WHERE piece_id=$1
                    AND ${itemType}_id=$2`,
                    [pieceId, itemId]
                );
                return 'deleted';
            }
        }
        throw new BadRequestError('Item Type must be string: "portfolio" or "tag". Action must be string: "add" or "remove".');
    };
};

module.exports = WriterUpload;