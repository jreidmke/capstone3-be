const db = require("../db");

async function checkForItem(value, table, column) {
    let result = await db.query(
        `SELECT * 
          FROM ${table}
          WHERE ${column}=$1`,
          [value]
    );

    const writer = result.rows[0];
    if(!writer) return false
    return writer;
};

module.exports = checkForItem;