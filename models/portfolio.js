// PORTFOLIO MODEL
const db = require("../db");
const { getUserHelper, checkForItem } = require("../helpers/checks");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Portfolio {
    static async getAll(userId) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);

        const portfolios = await checkForItem(user.writer_id, 'portfolios', 'writer_id', true);

        if(!portfolios.length) throw new NotFoundError(`User: ${userId} Has No Portfolios`);

        return portfolios;
    };

    static async getById(userId, portfolioId) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);

        const portfolio = await checkForItem(portfolioId, 'portfolios', 'id');

        if(!portfolio) throw new NotFoundError(`Portfolio with ID: ${id} Not Found!`);
        if(portfolio.writer_id !== user.writer_id) throw new UnauthorizedError();

        return portfolio;
    };

    static async createPortfolio(userId, title) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
        const result = await db.query(
            `INSERT INTO portfolios (writer_id, title)
            VALUES ($1, $2)
            RETURNING title`,
            [user.writer_id, title]
        );
        const portfolio = result.rows[0];
        return portfolio;
    };

    static async removePortfolio(userId, portfolioId) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
        const portfolio = await checkForItem(portfolioId, 'portfolios', 'id');
        if(portfolio.writer_id !== user.writer_id) throw new UnauthorizedError();
        await db.query(
            `DELETE FROM portfolios
            WHERE id=$1`,
            [portfolioId]
        );
    };
};

module.exports = Portfolio;

// CREATE PORTFOLIO
// -Input: author username, title
// -Success returns username and title
// -Failure throws SchemaError
// -Limiations: new portfolio schema, ensureCorrectUserOrAdmin

// EDIT PORTFOLIO
// -INPUT: title, new title
// -Success returns new title
// -Failure throws notFoundError
// -Limitations update portfolio schema, ensureCorrectUserOrAdmin

// REMOVE PORTFOLIO
// -INPUT: title
// -Success returns undefined
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin

// ADD PIECE TO PORTFOLIO
// -INPUT: portfolio_title, piece_title
// -Success returns portfolio data
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin

// REMOVE PIECE FROM PORTFOLIO
// -INPUT: portfolio_title, piece_title
// -Success returns portfolio data
// -Failure throws notFoundError
// -Limitations: ensureCorrectUserOrAdmin