const db = require("../db");

class Admin {
    static async getAllUsers() {
        const result = await db.query(
            `SELECT * FROM users`
        );
        return result.rows;
    };
};

module.exports = Admin;