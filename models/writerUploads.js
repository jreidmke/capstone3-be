const db = require("../db");
const { getUserHelper, checkForItem } = require("../helpers/checks");
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

    static async getById(userId, itemId, itemType) {
        if(itemType==="piece" || itemType==="portfolio") {
            const user = await getUserHelper(userId);
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(!item) throw new NotFoundError(`${itemType} with ID: ${itemId} Not Found!`);
            if(user.writer_id !== item.writer_id) throw new UnauthorizedError();
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
};

module.exports = WriterUpload;