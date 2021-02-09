// **
// WRITERS//
// **

"use strict";

const express = require("express");
const User = require("../models/user");
const Writer = require("../models/writer");
const Portfolio = require("../models/portfolio");
const Follow = require("../models/follow");
const Piece = require("../models/piece");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

/**GET / => {writers: [ {first_name, last_name, image_url, city, state, facebookUsername, twitterUsername, youtubeUesrname}, ...]}
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
 * Returns { first_name, last_name, image_url, city, state, facebookUsername, twitterUsername, youtubeUesrname, age, bio, createdAt, address1, address2, phone, portfolios}
 *      where portfolios is { id, title }
 *
 * Auth required: ensure logged in.
 */

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const writer = await User.getById(req.params.id, "writer");
        return res.json({ writer });
    } catch (error) {
        return next(error);
    }
});





// PATCH /writers/writer username/edit
// Only viewable by admin/username
// Sends request to update write data in database






/**GET /[id]/followed_tags => [{id, writer_id, tag_id, timestamps},...]
 *
 * Auth: admin or correct user
 */

router.get("/:id/followed_tags", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const tags = await Follow.getItemFollows(req.params.id, "writer", "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

/**POST /[id]/followed_tags/[tag_id] => {followed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
*/

router.post("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Follow.followItem(req.params.id, req.params.tag_id, "writer", "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /[id]/followed_tags/[tag_id] => {unfollowed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
 */

router.delete("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Follow.unfollowItem(req.params.id, req.params.tag_id, "writer", "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

/**GET /[id]/followed_platforms => [{id, writer_id, tag_id, timestamps},...]
 *
 * Auth: admin or correct user
 */

router.get("/:id/followed_platforms", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const platforms = await Follow.getItemFollows(req.params.id, "writer", "platform");
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    };
});

/**POST /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.post("/:id/followed_platforms/:platform_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Follow.followItem(req.params.id, req.params.platform_id, "writer", "platform");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

/**DELETE /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.delete("/:id/followed_platforms/:platform_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Follow.unfollowItem(req.params.id, req.params.platform_id, "writer", "platform");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;

// *
// *
// // //PORTFOLIOS
// *

router.get("/:id/portfolios", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const portfolios = await Portfolio.getAll(req.params.id);
        return res.json({ portfolios });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/portfolios", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const { title } = req.body;
        const newPortfolio = await Portfolio.createPortfolio(req.params.id, title);
        return res.json({ newPortfolio });
    } catch (error) {
        return next(error);
    }
});

router.get("/:id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const portfolio = await Portfolio.getById(req.params.id, req.params.portfolio_id);
        return res.json({ portfolio });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const deleted = await Portfolio.removePortfolio(req.params.id, req.params.portfolio_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
});

//PATCH /writers/writer username/portfolios/portfolio id/edit
//ONLY VIEWABLE BY ADMIN/USERNAME
// Sends patch to UPDATE portfolio name

//** */
//** */
// //PIECES
//** */
//** */

router.get("/:id/pieces", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const pieces = await Piece.getAll(req.params.id);
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
});

router.get("/:id/pieces/:piece_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const piece = await Piece.getById(req.params.id, req.params.piece_id);
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/pieces", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const { title, text } = req.body;
        const newPiece = await Piece.createPiece(req.params.id, title, text);
        return res.json({ newPiece });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/pieces/:piece_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const piece = await Piece.removePiece(req.params.id, req.params.piece_id);
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});
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