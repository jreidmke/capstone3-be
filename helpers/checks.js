const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

async function checkForItem(value, table, column) {
    let result = await db.query(
        `SELECT *
          FROM ${table}
          WHERE ${column}=$1`,
          [value]
    );

    const item = result.rows[0];
    if(!item) return false;
    if(item.password) delete item.password;
    return item;
};

async function checkForFollow(userId, itemId, userType, itemType) {
    let result = await db.query(
        `SELECT *
        FROM ${userType}_${itemType}_follows
        WHERE ${userType}_id=$1
        AND ${itemType}_id=$2`,
        [userId, itemId]
    );

    const follow = result.rows[0];
    console.log(follow);
    if(follow) return true;
    return false;
}

async function getUserHelper(id) {
    const result = await db.query(
        `SELECT id, writer_id, platform_id
        FROM users
        WHERE id=$1`,
        [id]
    );
    let user = result.rows[0];
    if(!user) return false;
    return user;
};

module.exports = {checkForItem, getUserHelper, checkForFollow};