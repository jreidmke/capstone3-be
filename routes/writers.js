// **
// WRITERS//
// **

"use strict";

const express = require("express");
const User = require("../models/user");
const Writer = require("../models/writer");
const Follow = require("../models/follow");
const WriterUpload = require("../models/writerUploads");
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
        const portfolios = await WriterUpload.getAll(req.params.id, "portfolio");
        return res.json({ portfolios });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/portfolios", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const { title } = req.body;
        const newPortfolio = await WriterUpload.createPortfolio(req.params.id, title);
        return res.json({ newPortfolio });
    } catch (error) {
        return next(error);
    }
});

router.get("/:id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const portfolio = await WriterUpload.getById(req.params.id, req.params.portfolio_id, "portfolio");
        return res.json({ portfolio });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const deleted = await WriterUpload.remove(req.params.id, req.params.portfolio_id, "portfolio");
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
        const pieces = await WriterUpload.getAll(req.params.id, "piece");
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
});

router.get("/:id/pieces/:piece_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const piece = await WriterUpload.getById(req.params.id, req.params.piece_id, "piece");
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/pieces", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const { title, text } = req.body;
        const newPiece = await WriterUpload.createPiece(req.params.id, title, text);
        return res.json({ newPiece });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/pieces/:piece_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const piece = await WriterUpload.remove(req.params.id, req.params.piece_id, "piece");
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/pieces/:piece_id/tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const newPieceTag = await WriterUpload.addItemToPiece(req.params.id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ newPieceTag });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/pieces/:piece_id/tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const removedItem = await WriterUpload.removeItemFromPiece(req.params.id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ removedItem });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/pieces/:piece_id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const newPiecePortfolio = await WriterUpload.addItemToPiece(req.params.id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ newPiecePortfolio });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/pieces/:piece_id/portfolios/:portfolio_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const removedItem = await WriterUpload.removeItemFromPiece(req.params.id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ removedItem });
    } catch (error) {
        return next(error);
    }
});
