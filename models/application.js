// APPLICATION MODEL
const db = require("../db");
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

    //Returns all applications by gig or writer id
    static async getByUserId(userId, userType) {
      const results = await db.query(`SELECT * FROM applications WHERE ${userType}_id=$1`, [userId]);
      if(!results.rows.length) throw new NotFoundError();
      return results.rows[0];
    };

    //Posts application and returns relavent data
    static async submitApplication(writerId, gigId, portfolioId) {
      const dupeCheck = await db.query(
        `SELECT * FROM applications
        WHERE writer_id=$1
        AND gig_id=$2`,
        [writerId, gigId]
      );

      if(dupeCheck.rows[0]) throw new BadRequestError("You\'ve already applied to this gig!!");

      const result = await db.query(
        `INSERT INTO applications (gig_id, writer_id, portfolio_id)
        VALUES ($1, $2, $3)
        RETURNING gig_id AS gigId, writer_id AS writerId, portfolio_id AS portfolioId`,
        [gigId, writerId, portfolioId]
      );
      return result.rows[0];
    };

    //Removes application from table. Only writer can ping
    static async withdrawlApplication(gigId, writerId) {
      const result = await db.query(
        `DELETE FROM applications 
        WHERE gig_id=$1 AND writer_id=$2`, [gigId, writerId]
      );
      return 'Application removed'
    };

    //Updates application status. Only platform can ping
    static async setApplicationStatus(applicationId, status) {
      const result = await db.query(
        `UPDATE applications
        SET status=$1
        WHERE id=$2
        RETURNING *`,
        [status, applicationId]
      );
      return result.rows[0];
    };
}

module.exports = Application;