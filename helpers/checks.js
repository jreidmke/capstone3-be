const db = require("../db");

async function checkForItem(value, table, column) {
    let result = await db.query(
        `SELECT * 
          FROM ${table}
          WHERE ${column}=$1`,
          [value]
    );

    const resp = result.rows[0];
    if(!resp) return false
    return resp;
};

module.exports = checkForItem;