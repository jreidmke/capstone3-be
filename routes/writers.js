// **
// WRITERS//
// **

"use strict";

const express = require("express");
const Writer = require("../models/writer");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");

const router = express.Router();

/**GET / => {writers: [ {username, first_name, last_name, image_url, location}, ...]}
 * 
 * Returns a list of all writers
 * 
 * Auth required: ensure logged in.
 */

router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const writers = await Writer.getAll();
        return res.json({ writers });
    } catch (error) {
        return next(error);
    }
});

/**GET /[username] => {user}
 * 
 * Returns { username, firstName, lastName, image_url, age, location, email, phone, twitterUsername, facebookUsername, youtubeUsername, portfolios }
 *      where portfolios is { id, title, writer_username}
 *  
 * Auth required: ensure logged in.
 */ 

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const writer = await Writer.getById(req.params.id);
        return res.json({ writer });
    } catch (error) {
        return next(error);
    }
})





// PATCH /writers/writer username/edit
// Only viewable by admin/username
// Sends request to update write data in database





/**DELETE /[username] => { deleted: username }
 * 
 * Auth: admin or correct user
 */

router.delete("/:id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        await Writer.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (error) {
        return next(error);
    }
});

/**GET /[username]/followed_tags => [{username, tagTitle},...]
 * 
 * Auth: admin or correct user
 */

router.get("/:username/followed_tags", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const tags = await Writer.getFollowedTags(req.params.username);
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

/**POST /[username]/followed_tags/[tagTitle] => {followed: {username, tagTitle}} 
 * 
 * Auth: admin or correct user
*/

router.post("/:username/followed_tags/:tagTitle", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Writer.followTag(req.params.username, req.params.tagTitle);
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /[username]/followed_tags/[tagTitle] => {unfollowed: {username, tagTitle}}
 * 
 * Auth: admin or correct user
 */

router.delete("/:username/followed_tags/:tagTitle", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Writer.unfollowTag(req.params.username, req.params.tagTitle);
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

/**GET /[username]/followed_platforms => [{username, platformHandle},...]
 * 
 * Auth: admin or correct user
 */

router.get("/:username/followed_platforms", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const platforms = await Writer.getFollowedPlatforms(req.params.username);
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    };
});

/**POST /[username]/followed_platforms/:platformHandle
 * 
 * Auth: admin or correct user
 */

router.post("/:username/followed_platforms/:platformHandle", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Writer.followPlatform(req.params.username, req.params.platformHandle);
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

/**DELETE /[username]/followed_platforms/:platformHandle
 * 
 * Auth: admin or correct user
 */

router.delete("/:username/followed_platforms/:platformHandle", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Writer.unfollowPlatform(req.params.username, req.params.platformHandle);
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
 
// GET /writers/writer username/edit (FRONT END STUFF)
// Only viewable by admin/username
// Shows a writers profile edit form

// GET /writers/writer_username/followed_tags (FRONT END NOTES)
// ONLY viewalbe by admin/username
// Shows a list of tags the writer is following with ICON LINKS TO send POST || DELETE reqs. 

// *
// *
// // //PORTFOLIOS
// *
// *

// GET /writers/writer username/portfolios
// Only viewable by admin/username
// Shows a list of writer portfolios

// GET /writers/writer username/portfolios/portfolio id
// Only viewable by admin/username
// Shows the contents of portfolio (a list of pieces)

//PATCH /writers/writer username/portfolios/portfolio id/edit
//ONLY VIEWABLE BY ADMIN/USERNAME
// Sends patch to UPDATE portfolio name

// GET /writers/writer_username/portfolios/new
// Only viewable by admin/username
// Shows form to create new portfolio

// POST /writers/writer_username/portfolios/new
// Only viewable by admin/username
// Makes POST to create new portfolio. Redirects to /writers/writer_username/portfolios. 

// GET /writers/writer_username/portfolios/:portfolio_id/add_pieces/
// Shows a list of all pices by author and AN ICON TO EITHER ADD OR REMOVE PIECE depending on wether or not it is present in portfolio. 

// POST /writers/writer_username/portfolios/:portfolio_id/add_piece/:piece_id
// Makes the actual post request when you CLICK ON AN ICON

// DELETE /writers/writer_username/portfolios/:portfolio_id/add_piece/:piece_id
// Deletes piece id and portfolio id from PORTFOLIO_PIECE db. 


//** */
//** */
// //PIECES
//** */
//** */


// GET /writers/writer username/pieces
// Only viewable by admin/username
// Shows a list of authoer's pieces

// GET /writers/writer username/pieces/:piece_id
// Only viewable by admin/username
// Shows the details of a piece

// GET /writers/writer_username/pieces/new (FE ROUTE)
// Shows form to create new piece

// POST /writers/writer_username/pieces/new
// Insert new piece into DB.

// GET /writers/writer username/pieces/:piece_id/edit
// Only viewable by admin/username
// Shows edit form to allow you to edit piece

// PATCH /writers/writer username/pieces/:piece_id/edit
// Only viewable by admin/username
// Makes patch request to update piece.

// GET /writers/writer_username/pieces/:piece_id/tags
// Shows two lists of tags. Tags that the piece is already tagged with as well as all other tags. 

// POST /writers/writer_username/pieces/:piece_id/tags/:tag_title
// Adds tag title and pice id to PIECE_TAG db. 

// DELETE /writers/writer_username/pieces/:piece_id/tags/:tag_title
// Removes tag title and piece id from PIECE_TAG db.