// APPLICATION MODEL
const db = require("../db");
const { getUserHelper, checkForItem, checkForPieceItem } = require("../helpers/checks");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError
} = require("../expressError");

class Application {

    //Returns all Applications. Just for Admin
    static async getAll() {
      const results = await db.query(`SELECT * FROM applications`);
      return results.rows;
    };

    //Returns all applications by user id
    static async getByUserId(writerId) {
      const results = await db.query(`SELECT * FROM applications WHERE writer_id=$1`, [writerId]);
      return results.rows[0];
    };

    //Posts application and returns relavent data
    static async submitApplication(writerId, gigId, portfolioId) {
      const results = await db.query(
        `INSERT INTO applications (gig_id, writer_id, portfolio_id)
        VALUES ($1, $2, $3)
        RETURNING gig_id AS gigId, writer_id AS writerId, portfolio_id AS portfolioId`,
        [gigId, writerId, portfolioId]
      );
      return results.rows[0];
    };

    //Removes application from table. Only writer can ping
    static async withdrawlApplication(writerId, applicationId) {

    };

    //Updates application status. Only platform can ping
    static async setApplicationStatus(platformId, gigId) {

    };
}

module.exports = Application;