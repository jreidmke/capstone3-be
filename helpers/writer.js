const db = require("../db");
const {NotFoundError} = require("../expressError");

async function checkForWriter(username) {
    let result = await db.query(
        `SELECT username 
          FROM writers
          WHERE username=$1`,
          [username]
    );

    const writer = result.rows[0];
    if(!writer) return false
    return writer;
};

module.exports = checkForWriter;