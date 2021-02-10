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

    };

    //Returns all applications by user id
    static async getByUserId(writerId) {

    };

    //Posts application and returns relavent data
    static async submitApplication(writerId, gigId) {

    };

    //Removes application from table. Only writer can ping
    static async withdrawlApplication(writerId, applicationId) {

    };

    //Updates application status. Only platform can ping
    static async setApplicationStatus(platformId, gigId) {

    };
}

module.exports = Application;