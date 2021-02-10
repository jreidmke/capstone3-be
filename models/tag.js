// TAG MODEL
const db = require("../db");
const { getUserHelper, checkForItem, checkForPieceItem } = require("../helpers/checks");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError
} = require("../expressError");

class Tag {
    
    static async getAll() {

    };

    static async getByIsFiction(isFiction) {

    };
};

module.exports = Tag;