const db = require("../db");
const {
    NotFoundError,
    BadRequestError
  } = require("../expressError");
const {checkForItem, getUserHelper, checkForFollow} = require('../helpers/checks');



class Follow {
    /**GET USER TAG FOLLOWS
     *
     * SUCCESS {id, userType string} => [{id, writer_id, tag_id, timestamps},...]
     *
     * Failure returns NotFoundError OR BadRequestError
     */

    static async getItemFollows(id, userType, itemType) {
        if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

            //Error handling
            const user = await getUserHelper(id);
            if(!user) throw new NotFoundError(`No User With ID: ${id}`);

            const itemRes = await db.query(
                `SELECT *
                FROM ${userType}_${itemType}_follows AS f
                JOIN ${itemType}s AS i ON f.${itemType}_id=i.id
                WHERE ${userType}_id=$1`,
                [user.writer_id ||user.platform_id]
            );
            const items = itemRes.rows;
            if(!items.length) throw new NotFoundError(`User with ID: ${id} not following any ${itemType}s!`);
            return items;
        }
        throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    };

    /**FOLLOW ITEM
     *
     * SUCESS: {id, itemId, userType string, itemType} => [followed: {writer_id, tag_id, tag_title}]
     *
     * Failure returns NotFoundError OR BadRequestError
     */

    static async followItem(userId, itemId, userType, itemType){
        if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

            //error handling

            const user = await getUserHelper(userId);
            if(!user) throw new NotFoundError(`No User With ID: ${userId}`);
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(!item) throw new NotFoundError(`No ${itemType} With Id: ${itemId}`);
            if(await checkForFollow(user.writer_id || user.platform_id, itemId, userType, itemType)) {
                throw new BadRequestError(`${userType} ${userId} already follows ${itemType} ${itemId}`);
            };

            //Insert into DB
            const followRes = await db.query(
                `INSERT INTO ${userType}_${itemType}_follows (${userType}_id, ${itemType}_id)
                VALUES ($1, $2)
                RETURNING ${itemType}_id AS ${itemType}Id, ${userType}_id AS ${userType}Id`,
                [user.writer_id ||user.platform_id, itemId]
            );

            //Return data to user
            const newFollow = followRes.rows[0];
            newFollow.title = item.title || item.display_name;
            return newFollow;
        }

        throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    };

    /**UNFOLLOW ITEM
     *
     * SUCESS: {id, itemId, userType string, itemType} => [followed: {writer_id, tag_id, tag_title}]
     *
     * Failure returns NotFoundError OR BadRequestError
     */

    static async unfollowItem(userId, itemId, userType, itemType) {
        if(userType==="writer" || userType==="platform" && itemType==="tag" || itemType==="platform" || itemType==="writer") {

            //error handling
            const user = await getUserHelper(userId);
            if(!user) throw new NotFoundError(`No User With ID: ${id}`);
            const item = await checkForItem(itemId, `${itemType}s`, 'id');
            if(!item) throw new NotFoundError(`No ${itemType} With Id: ${itemId}`);
            if(!await checkForFollow(user.writer_id || user.platform_id, itemId, userType, itemType)) {
                throw new BadRequestError(`${userType} ${userId} doesn't follow ${itemType} ${itemId}`);
            };

            //DELETE from database
            const unfollowRes = await db.query(
                `DELETE FROM ${userType}_${itemType}_follows
                WHERE ${userType}_id=$1
                AND ${itemType}_id=$2
                RETURNING ${itemType}_id AS ${itemType}Id, ${userType}_id AS ${userType}Id`,
                [user.writer_id ||user.platform_id, itemId]
            );

            //return data to user
            const unfollow = unfollowRes.rows[0];
            unfollow.title = item.title || item.display_name;
            return unfollow;
        };

        throw new BadRequestError('User Type must be string: "writer" OR "platform". Item Type must be string: "writer", "platform" or "tag"');
    }
};

module.exports = Follow;