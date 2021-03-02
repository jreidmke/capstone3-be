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
            `SELECT id, title, writer_id AS "writerId" 
            FROM portfolios 
            WHERE writer_id=$1`,
            [writerId]
        );
        const portfolios = result.rows;
        if(!portfolios.length) throw new NotFoundError(`Writer: ${writerId} has no portfolios.`);
        return portfolios;
    };

    /**Given a piece id, returns a piece
     * 
     * Returns {id, writer_id, title, text, created_at, updated_at, pieces, tags}
     *  where pieces {id, writer_id, title, text, created_at, updated_at} 
     *  and tags {title}
     * 
     * Failure throws not found
     */

    static async getById(portfolioId) {
        const result = await db.query(
            `SELECT p.id, 
                    p.title, 
                    p.writer_id AS "writerId", 
                    p.created_at AS "createdAt",
                    w.first_name AS "firstName",
                    w.last_name AS "lastName"
            FROM portfolios AS p
            JOIN writers AS w
            ON p.writer_id=w.id
            WHERE p.id=$1`,
            [portfolioId]
        );
        const portfolio = result.rows[0];

        //Error Handlers
        if(!portfolio) throw new NotFoundError(`Portfolio: ${portfolioId} Not Found!`);

        const pieceResult = await db.query(
            `SELECT p.id, p.writer_id AS "writerId", title, text, p.created_at AS "createdAt", p.updated_at AS "updatedAt" 
            FROM pieces AS p
            JOIN piece_portfolios AS pp
            ON p.id=pp.piece_id
            WHERE pp.portfolio_id=$1`,
            [portfolio.id]
        );
        let pieces = pieceResult.rows;
        portfolio.pieces = pieces;
            
        if(pieces.length) {
            const tagRes = await db.query(
                `SELECT t.title FROM tags AS t
                JOIN piece_tags AS pt
                ON t.id=pt.tag_id
                WHERE pt.piece_id IN (${pieces.map(p => p.id).join(',')})
                GROUP BY t.title`
            );
            portfolio.tags = tagRes.rows;
        }
        
        return portfolio
    };

    /** Create a portfolio (from data), update db, return new portfolio data.
   *
   * data should be { writerId, title }
   *
   * Returns the same
   * */

    static async create(writerId, title) {
        const result = await db.query(
            `INSERT INTO portfolios (writer_id, title)
            VALUES ($1, $2)
            RETURNING id, writer_id AS "writerId",
            title`,
            [writerId, title]
        );
        return result.rows[0];
    };

    /** Updates a portfolios title
     * 
     * Failure throws NotFoundError
     */

    static async update(writerId, portfolioId, title) {
        const authCheck = await db.query(
            `SELECT * FROM portfolios WHERE id=$1`,
            [portfolioId]
        );

        if(authCheck.rows[0].writer_id !== parseInt(writerId)) throw new UnauthorizedError();
        const result = await db.query(
            `UPDATE portfolios
            SET title=$1,
            updated_at=CURRENT_TIMESTAMP
            WHERE id=$2
            RETURNING id, title, writer_id AS "writerId", created_at AS "createdAt", updated_at AS "updatedAt"`,
            [title, portfolioId]
        );
        if(!result.rows[0]) throw new NotFoundError(`Portfolio: ${portfolioId} Not Found!`);
        return result.rows[0];
    };

    /** Delete given portfolio from database; returns all data on deleted portfolio.
    *
    * Throws NotFoundError if portfolio not found, UnauthorizedError is portfolio does not belong to writer.
    **/

    static async remove(writerId, portfolioId) {
        const authCheck = await db.query(
            `SELECT * FROM portfolios WHERE id=$1`,
            [portfolioId]
        );

        //Error Handling
        if(!authCheck.rows[0]) throw new NotFoundError(`Portfolio: ${portfolioId} Not Found!`);
        if(authCheck.rows[0].writer_id !== parseInt(writerId)) throw new UnauthorizedError();

        const result = await db.query(
            `DELETE FROM portfolios
            WHERE id=$1
            RETURNING *`,
            [portfolioId]
        );
        return result.rows[0];
    };
};

module.exports = Portfolio;