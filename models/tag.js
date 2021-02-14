// TAG MODEL
const db = require("../db");

class Tag {

   /** Find all tags (optional filter on searchFilters).
     *
     * searchFilters (all optional):
     * - isFiction
     * - search
     *
     * Returns [{ id, title, isFiction, created_at, updated_at }, ...]
     * */
    
    static async getAll(searchFilters = {}) {
      let query = `SELECT * FROM tags`;
      let whereExpressions = [];
      let queryValues = [];
      const { search, isFiction }= searchFilters;

      if(isFiction !== undefined) {
        queryValues.push(isFiction);
        whereExpressions.push(`is_fiction=$${queryValues.length}`);
      };

      if(whereExpressions.length > 0) {
        query += " WHERE " + whereExpressions.join(" AND ");
      };

      if(search !== undefined) {
        if(!whereExpressions.length) {
          query += ` WHERE title LIKE '%${search}%'`;
        } else {
          query += ` AND title LIKE '%${search}%'`;
        };
      };

      const results = await db.query(query, queryValues);
      return results.rows;
    };
};

module.exports = Tag;