// **
// WRITERS//
// **

"use strict";

const express = require("express");
const Writer = require("../models/writer");
const { ensureLoggedIn, ensureCorrectWriterOrAdmin } = require("../middleware/auth");
const Application = require("../models/application");
const Portfolio = require("../models/portfolio");
const Piece = require("../models/piece");
const jsonschema = require("jsonschema");
const createPiece = require("../schemas/createPiece.json");
const { BadRequestError } = require("../expressError");

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

router.get("/:writer_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const writer = await Writer.getById(req.params.writer_id);
        return res.json({ writer });
    } catch (error) {
        return next(error);
    }
});

/**DELETE NEEDS DOC STRINGS*/

router.delete("/:writer_id", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const deleted = Writer.remove(req.params.writer_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
})

/**GET /[id]/followed_tags => [{id, writer_id, tag_id, timestamps},...]
 *
 * Auth: admin or correct user
 */

router.get("/:writer_id/followed_tags", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const tags = await Writer.getFollows(req.params.writer_id, "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

/**POST /[id]/followed_tags/[tag_id] => {followed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
*/

router.post("/:writer_id/followed_tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const followed = await Writer.followItem(req.params.writer_id, req.params.tag_id, "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /[id]/followed_tags/[tag_id] => {unfollowed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
 */

router.delete("/:writer_id/followed_tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Writer.unfollowItem(req.params.writer_id, req.params.tag_id, "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

/**GET /[id]/followed_platforms => [{id, writer_id, tag_id, timestamps},...]
 *
 * Auth: admin or correct user
 */

router.get("/:writer_id/followed_platforms", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const platforms = await Writer.getFollows(req.params.writer_id, "platform");
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    };
});

/**POST /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.post("/:writer_id/followed_platforms/:platform_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const followed = await Writer.followItem(req.params.writer_id, req.params.platform_id, "platform");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

/**DELETE /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.delete("/:writer_id/followed_platforms/:platform_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Writer.unfollowItem(req.params.writer_id, req.params.platform_id, "platform");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

// *
// // //PORTFOLIOS
// *

router.get("/:writer_id/portfolios", ensureLoggedIn, async function(req, res, next) {
    try {
        const portfolios = await Portfolio.getAllByWriterId(req.params.writer_id);
        return res.json({ portfolios });
    } catch (error) {
        return next(error);
    }
});

router.get("/:writer_id/portfolios/:portfolio_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const portfolio = await Portfolio.getById(req.params.portfolio_id);
        return res.json({ portfolio });
    } catch (error) {
        return next(error);
    }
});

router.post("/:writer_id/portfolios/new", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        if(!req.body.title) throw new BadRequestError('Must inlude property Title');
        const newPortfolio = await Portfolio.create(req.params.writer_id, req.body.title);
        return res.json({ newPortfolio });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:writer_id/portfolios/:portfolio_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const deleted = await Portfolio.remove(req.params.writer_id, req.params.portfolio_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
});

//Add Piece to Portfolio

router.post("/:writer_id/portfolios/:portfolio_id/pieces/:piece_id/", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const newPiecePortfolio = await Portfolio.addPieceToItem(req.params.writer_id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ newPiecePortfolio });
    } catch (error) {
        return next(error);
    }
});

//Remove Piece From Portfolio

router.delete("/:writer_id/portfolios/:portfolio_id/pieces/:piece_id/", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const removedItem = await Portfolio.removePieceFromItem(req.params.writer_id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ removedItem });
    } catch (error) {
        return next(error);
    };
});

//** */
// //PIECES
//** */

router.get("/:writer_id/pieces", ensureLoggedIn, async function(req, res, next) {
    try {
        const pieces = await Piece.getAllByWriterId(req.params.writer_id);
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
});

router.get("/:writer_id/pieces/:piece_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const piece = await Piece.getById(req.params.piece_id);
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});

router.post("/:writer_id/pieces/new", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, createPiece);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { title, text } = req.body;
        const newPiece = await Piece.create(req.params.writer_id, title, text);
        return res.json({ newPiece });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:writer_id/pieces/:piece_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const piece = await Piece.remove(req.params.writer_id, req.params.piece_id);
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});

//
//**PIECE TAGS */
//

router.post("/:writer_id/pieces/:piece_id/tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const newPieceTag = await Piece.addPieceToItem(req.params.writer_id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ newPieceTag });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:writer_id/pieces/:piece_id/tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const removedItem = await Piece.removePieceFromItem(req.params.writer_id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ removedItem });
    } catch (error) {
        return next(error);
    }
});

//Applications

router.get("/:writer_id/applications", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const apps = await Application.getByUserId(req.params.writer_id, "writer");
        return res.json({ apps });
    } catch (error) {
        return next(error);
    };
});

module.exports = router;