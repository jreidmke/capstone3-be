const db = require("../db");

async function checkForItem(value, table, column) {
    let result = await db.query(
        `SELECT *
          FROM ${table}
          WHERE ${column}=$1`,
          [value]
    );

    const item = result.rows[0];
    if(!item) throw new NotFoundError(`No ${table} With ${column}: ${id}`);
    if(item.password) delete item.password;
    return item;
};

async function getUserHelper(id) {
    const result = await db.query(
        `SELECT id, writer_id, platform_id
        FROM users
        WHERE id=$1`,
        [id]
    );
    let user = result.rows[0];
    if(!user) throw new NotFoundError(`No User With Id: ${id}`);
    return user;
};

module.exports = {checkForItem, getUserHelper};