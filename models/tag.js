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
      let query = `SELECT id, title, is_fiction AS "isFiction", created_at AS "createdAt", updated_at AS "updatedAt" FROM tags`;
      let whereExpressions = [];
      let queryValues = [];
      const { search, isFiction, tagIds }= searchFilters;

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

      if(tagIds !== undefined) {
        if(!whereExpressions.length) {
          query += ` WHERE id IN (${tagIds})`
        } else {
          query += ` AND id in (${tagIds})`
        };
      };

      query += ` ORDER BY title`

      const results = await db.query(query, queryValues);
      return results.rows;
    };

    static async getById(tagIds) {
      const result = await db.query(
        `SELECT id, title, is_fiction AS "isFiction" FROM tags WHERE id IN (${tagIds})`
      );
      return result.rows;
    }
};

module.exports = Tag;