// TAG MODEL
const db = require("../db");

class Tag {
    
    static async getAll() {
      const results = await db.query(`SELECT * FROM tags`);
      return results.rows;
    };

    static async getByIsFiction(isFiction) {
      const results = await db.query(`SELECT * FROM tags WHERE is_fiction=$1`, [isFiction]);
      return results.rows;
    };

    static async getBySearch(searchTerm) {
      console.log(searchTerm);
      const results = await db.query(`SELECT * FROM tags WHERE title LIKE '%${searchTerm}%'`);
      return results.rows;
    }
};

module.exports = Tag;