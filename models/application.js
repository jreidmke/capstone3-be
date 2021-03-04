// APPLICATION MODEL
const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");

class Application {

    /** Given an userType and id, returns all applications.
   *
   * Returns [{ id, gig_id, writer_id, portfolio_id, status, created_at, updated_at },...]
   *
   * Throws BadRequestError if incorrect usertype.
   **/
    static async getByUserId(userId, userType) {
      if(userType !== 'writer' && userType !== 'gig') throw new BadRequestError("User Type must be string: 'writer' or 'gig'.")
      const results = await db.query(`SELECT a.id, 
                                             a.gig_id AS "gigId", 
                                             a.writer_id AS "writerId", 
                                             a.portfolio_ID AS "portfolioId",
                                             a.status, 
                                             a.created_at AS "createdAt",
                                             w.first_name AS "firstName",
                                             w.last_name AS "lastName",
                                             p.title AS "portfolioTitle",
                                             g.platform_id AS
                                             "platformId",
                                             g.title AS "gigTitle",
                                             pl.display_name AS "platformName"
                                      FROM applications AS a
                                      JOIN writers AS w
                                      ON a.writer_id=w.id
                                      JOIN portfolios AS p
                                      ON a.portfolio_id=p.id
                                      JOIN gigs AS g
                                      ON a.gig_id=g.id
                                      JOIN platforms AS pl
                                      ON g.platform_id=pl.id
                                      WHERE a.${userType}_id=$1`, [userId]);
      return results.rows;
    };

    static async getByPlatformId(platformId) {
      const result = await db.query(`SELECT a.id,
                                            a.gig_id AS "gigId",
                                            a.writer_id AS "writerId",
                                            a.portfolio_id AS "portfolioId",
                                            a.status,
                                            a.created_at AS "createdAt",
                                            p.title AS "portfolioTitle",
                                            g.title AS "gigTitle",
                                            w.first_name AS "firstName",
                                            w.last_name AS "lastName"
                                      FROM applications AS a
                                      JOIN portfolios AS p
                                      ON a.portfolio_id=p.id
                                      JOIN gigs AS g
                                      ON g.id=a.gig_id
                                      JOIN platforms
                                      ON g.platform_id=platforms.id
                                      JOIN writers AS w
                                      ON a.writer_id = w.id
                                      WHERE platforms.id=$1`,
                                      [platformId]);
      const applications = result.rows;
      console.log(applications)
      // if(!applications.length) throw new NotFoundError(`Platform: ${platformId} Not Found!`);
      return applications;
    };

    static async getById(platformId, appId) {
      const results = await db.query(`SELECT a.id, 
                                             a.gig_id AS "gigId", 
                                             a.writer_id AS "writerId", 
                                             a.portfolio_ID AS "portfolioId",
                                             a.status, 
                                             a.created_at AS "createdAt",
                                             w.first_name AS "firstName",
                                             w.last_name AS "lastName",
                                             p.title AS "portfolioTitle",
                                             g.platform_id AS
                                             "platformId"
                                      FROM applications AS a
                                      JOIN writers AS w
                                      ON a.writer_id=w.id
                                      JOIN portfolios AS p
                                      ON a.portfolio_id=p.id
                                      JOIN gigs AS g
                                      ON a.gig_id=g.id
                                      WHERE a.id=$1`, [appId]);
      const app = results.rows[0];
      if(!app) throw new NotFoundError(`App: ${appId} not Found!`);
      if(app.platformId != platformId) throw new UnauthorizedError();
      return app;
    }

    /**Create an application (from writerId, gigId, portfolioId data)
     * 
     * Returns application object.
     * 
     * Duplicate Application throws BadReq Error
     */

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
        RETURNING gig_id AS "gigId", writer_id AS "writerId", portfolio_id AS "portfolioId"`,
        [gigId, writerId, portfolioId]
      );
      return result.rows[0];
    };

    /** Deletes application from db
     * 
     * Returns data on deleted application.
     */

    static async withdrawlApplication(gigId, writerId) {
      const result = await db.query(
        `DELETE FROM applications 
        WHERE gig_id=$1 AND writer_id=$2
        RETURNING gig_id AS "gigId",
        writer_id AS "writerId"`, [gigId, writerId]
      );
      return result.rows[0];
    };

    /** UPDATES application db (form appId and status data)
     * 
     * Returns updated application, including status
     * 
     * Failure throws Not Found.
     */
    
    static async setApplicationStatus(applicationId, status) {
      const result = await db.query(
        `UPDATE applications
        SET status=$1,
        updated_at=CURRENT_TIMESTAMP
        WHERE id=$2
        RETURNING id, gig_id AS "gigId", writer_id AS "writerId", portfolio_ID AS "portfolioId", status, created_at AS "createdAt", updated_at AS "updatedAt"`,
        [status, applicationId]
      );
      if(!result.rows[0]) throw new NotFoundError(`Application: ${applicationId} not found!`);
      return result.rows[0];
    };
}

module.exports = Application;