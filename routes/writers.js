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
const updatePiece = require("../schemas/updatePiece.json");
const updateWriter = require("../schemas/updateWriter.json");
const writerQP = require("../schemas/writerQP.json");
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
        const validator = jsonschema.validate(req.query, writerQP);
        if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
        }
        const writers = await Writer.getAll(req.query);
        return res.json({ writers });
    } catch (error) {
        return next(error);
    }
});

/**GET /[writerId] => {user}
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

/**UPDATE WRITER portfolio */

router.patch("/:writer_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateWriter);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { writerData, userData } = req.body;
        const updatedWriter = await Writer.update(req.params.writer_id, writerData, userData);
        return res.json({ updatedWriter });
    } catch (error) {
        return next(error);
    }
})

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

/**POST /[writerId]/followed_platforms/:platformHandle
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

/**DELETE /[writerId]/followed_platforms/:platformHandle
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

/** GET /writers/[writerId]/portfolios
 * 
 * RETURNS A LIST OF ALL PORTFOLIOS BY WRITER
 * 
 * Auth: Ensure Logged in
 */

router.get("/:writer_id/portfolios", ensureLoggedIn, async function(req, res, next) {
    try {
        const portfolios = await Portfolio.getAllByWriterId(req.params.writer_id);
        return res.json({ portfolios });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /writers/[writerId]/portfolios/[portfolioId]
 * 
 * Updates portfolio in db
 * 
 * RETURNS A PORTFOLIO SPECIFIED BY ID
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.patch("/:writer_id/portfolios/:portfolio_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        if(!req.body.title) throw new BadRequestError('Must change title!');
        const updatedPortfolio = await Portfolio.update(req.params.writer_id, req.params.portfolio_id, req.body.title);
        return res.json({ updatedPortfolio });
    } catch (error) {
        return next(error);
    }
});

/** POST /writers/[writerId]/portfolios/new
 * 
 * Creates a new portfolio and inserts in db
 * 
 * RETURNS A NEW PORTFOLIO
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.post("/:writer_id/portfolios/new", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        if(!req.body.title) throw new BadRequestError('Must inlude property Title');
        const newPortfolio = await Portfolio.create(req.params.writer_id, req.body.title);
        return res.json({ newPortfolio });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /writers/[writerId]/portfolios/[portfolioId]
 * 
 * Deletes portfolio in db
 * 
 * RETURNS A DELETED PORTFOLIO
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.delete("/:writer_id/portfolios/:portfolio_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const deleted = await Portfolio.remove(req.params.writer_id, req.params.portfolio_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
});

/** POST /writers/[writerId]/portfolios/pieces/[pieceId]
 * 
 * Adds Piece to Portfolio
 * 
 * RETURNS Data on newly inserted portfolio piece.
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.post("/:writer_id/portfolios/:portfolio_id/pieces/:piece_id/", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const newPiecePortfolio = await Piece.addPieceToItem(req.params.writer_id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ newPiecePortfolio });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /writers/[writerId]/portfolios/pieces/[pieceId]
 * 
 * Removes piece from Portfolio
 * 
 * RETURNS Data on newly deleted portfolio piece.
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.delete("/:writer_id/portfolios/:portfolio_id/pieces/:piece_id/", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const removedItem = await Piece.removePieceFromItem(req.params.writer_id, req.params.piece_id, req.params.portfolio_id, "portfolio");
        return res.json({ removedItem });
    } catch (error) {
        return next(error);
    };
});

//** */
// //PIECES
//** */

/** GET /writers/[writerId]/pieces
 * 
 * RETURNS A LIST OF ALL PIECES BY WRITER
 * 
 * Auth: Ensure Logged in
 */

router.get("/:writer_id/pieces", ensureLoggedIn, async function(req, res, next) {
    try {
        const pieces = await Piece.getAllByWriterId(req.params.writer_id);
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
});

/** POST /writers/[writerId]/pieces/new
 * 
 * Creates a new piece and inserts in db
 * 
 * RETURNS A NEW PIECE
 * 
 * Auth: Ensure Admin or Correct writer
 */

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

/** PATCH /writers/[writerId]/pieces/[pieceID]
 * 
 * Updates piece in db
 * 
 * RETURNS A PIECE SPECIFIED BY ID
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.patch("/:writer_id/pieces/:piece_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updatePiece);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const updatedPiece = await Piece.update(req.params.writer_id, req.params.piece_id, req.body);
        return res.json({ updatedPiece });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /writers/[writerId]/pieces/[pieceID]
 * 
 * Deletes  piece in db
 * 
 * RETURNS A DELETED PIECE
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.delete("/:writer_id/pieces/:piece_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const deletedPiece = await Piece.remove(req.params.writer_id, req.params.piece_id);
        return res.json({ deletedPiece });
    } catch (error) {
        return next(error);
    }
});

//
//**PIECE TAGS */
//

/**POST /writers/[writerId]/pieces/[pieceID]/tags/[tagId]
 * 
 * Inserts new piece_tag into db
 * 
 * Returns new Piece-tag
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.post("/:writer_id/pieces/:piece_id/tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const newTag = await Piece.addPieceToItem(req.params.writer_id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ newTag });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /writers/[writerId]/pieces/[pieceID]/tags/[tagId]
 * 
 * Deletes a piece_tag from db
 * 
 * Returns a deleted Piece-tag
 * 
 * Auth: Ensure Admin or Correct writer
 */

router.delete("/:writer_id/pieces/:piece_id/tags/:tag_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const removedTag = await Piece.removePieceFromItem(req.params.writer_id, req.params.piece_id, req.params.tag_id, "tag");
        return res.json({ removedTag });
    } catch (error) {
        return next(error);
    }
});

/**GET /writers/[writerId]/applications
 * 
 * Returns a list of applications by writer ID.
 */

router.get("/:writer_id/applications", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const apps = await Application.getByUserId(req.params.writer_id, "writer");
        return res.json({ apps });
    } catch (error) {
        return next(error);
    };
});


/** GET APPLICATION MESSAGES
 * 
 * 
 */

router.get("/:writer_id/application-messages", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const appMsgs = await Writer.getApplicationMessagesByWriterId(req.params.writer_id);
        return res.json({ appMsgs });
    } catch (error) {
        return next(error);
    }
});

/** DISMISS APPLICATION MESSAGE
 * 
 * 
 */

router.delete("/:writer_id/application-messages/:application_message_id", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const deletedAppMsg = await Writer.dismissApplicationMessage(req.params.application_message_id);
        return res.json({"deleted": "deleted"});
    } catch (error) {
        return next(error);
    }
})

/**GET /writers/[writerId]/queries
 * 
 * Returns a list of writer queries
 * 
 * Auth: Ensure correct writer or admin
 */

router.get("/:writer_id/queries", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const queries = await Writer.getAllQueriesByWriterId(req.params.writer_id);
        return res.json({ queries });
    } catch (error) {
        return next(error);
    }
})

//FEED STUFF

router.get("/:writer_id/feed/tags/", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const gigs = await Writer.getGigsForFeedFromTags(req.query.tag_ids);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

router.get("/:writer_id/feed/platforms/", ensureCorrectWriterOrAdmin, async(req, res, next) => {
    try {
        const gigs = await Writer.getGigsForFeedFromPlatforms(req.query.platform_ids);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;