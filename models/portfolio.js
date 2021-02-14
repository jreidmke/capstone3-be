const db = require("../db");
const {
  NotFoundError, 
  UnauthorizedError
} = require("../expressError");

class Portfolio {

    /**Given a writer id, returns all portfolios by writer
     * 
     * Returns [{id, writer_id, title, created_at, updated_at},...]
     */
    
    static async getAllByWriterId(writerId) {
        const result = await db.query(
            `SELECT * FROM portfolios 
            WHERE writer_id=$1`,
            [writerId]
        );
        const portfolios = result.rows;
        if(!portfolios.length) throw new NotFoundError(`Writer: ${writerId} has no portfolios.`);
        return portfolios;
    };

    static async getById(portfolioId) {
        const result = await db.query(
            `SELECT * FROM portfolios
            WHERE id=$1`,
            [portfolioId]
        );
        const portfolio = result.rows[0];

        //Error Handlers
        if(!portfolio) throw new NotFoundError(`Portfolio:${portfolioId} Not Found!`);

        const pieceResult = await db.query(
            `SELECT * FROM pieces AS p
            JOIN piece_portfolios AS pp
            ON p.id=pp.piece_id
            WHERE pp.portfolio_id=$1`,
            [portfolio.id]
        );

        portfolio.pieces = pieceResult.rows;
        return portfolio
    };

    static async create(writerId, title) {
        const result = await db.query(
            `INSERT INTO portfolios (writer_id, title)
            VALUES ($1, $2)
            RETURNING writer_id AS writerId,
            title`,
            [writerId, title]
        );
        return result.rows[0];
    };

    static async update(portfolioId, title) {
        const result = await db.query(
            `UPDATE portfolios
            SET title=$1
            WHERE id=$2
            RETURNING *`,
            [title, portfolioId]
        );
        if(!result.rows[0]) throw new NotFoundError(`Portfolio: ${portfolioId} Not Found!`);
        return result.rows[0];
    }

    static async remove(writerId, portfolioId) {
        const authCheck = await db.query(
            `SELECT * FROM portfolios WHERE id=$1`,
            [portfolioId]
        );

        //Error Handling
        if(!authCheck.rows[0]) throw new NotFoundError(`Portfolio: ${portfolioId} Not Found!`);
        if(authCheck.rows[0].writer_id !== writerId) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM portfolios
            WHERE id=$1
            RETURNING *`,
            [portfolioId]
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

module.exports = Portfolio;