// PORTFOLIO MODEL
const db = require("../db");
const { getUserHelper } = require("../helpers/checks");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Portfolio {
    static async getAll(userId) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
        const result = await db.query(
            `SELECT *
            FROM portfolios
            WHERE id=$1`,
            [user.writer_id]
        );
        const portfolio = result.rows;
        if(!portfolio.length) throw new NotFoundError(`User: ${userId} Has No Portfolios`);
        return portfolio;
    }

    static async getById(portfolioId, userId) {
        const user = await getUserHelper(userId);
        if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
        const result = await db.query(
            `SELECT *
            FROM portfolios
            WHERE id=$1`,
            [portfolioId]
        );
        const portfolio = result.rows[0];
        if(!portfolio) throw new NotFoundError(`Portfolio with ID: ${id} Not Found!`);
        if(portfolio.writer_id !== user.writer_id) throw new UnauthorizedError();
        return portfolio;
    }
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