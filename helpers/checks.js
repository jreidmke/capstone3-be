const db = require("../db");

async function checkForItem(value, table, column, isArray=false) {
    let result = await db.query(
        `SELECT *
          FROM ${table}
          WHERE ${column}=$1`,
          [value]
    );

    const item = isArray ? result.rows : result.rows[0];
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

    if(follow) return true;
    return false;
};

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

async function checkForPieceItem(pieceId, itemId, itemType) {
    let result = await db.query(
        `SELECT *
        FROM piece_${itemType}s
        WHERE piece_id=$1
        AND ${itemType}_id=$2`,
        [pieceId, itemId]
    );
    let item = result.rows[0];
    if(!item) return false;
    return item;
}



module.exports = {checkForItem, getUserHelper, checkForFollow, checkForPieceItem};