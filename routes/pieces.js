const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const Piece = require("../models/piece");
const Gig = require("../models/gig");

/** GET /pieces =>
 *   { jobs: [ { id, writerId, title, text, createdAt }, ...] }
 *
 * GET ALL PIECES
 * 
 * Can provide search filter in query:
     * - tagTitle
     * - text
     * 
 * Authorization required: Logged In
 */

router.get("/", ensureLoggedIn, async function(req, res, next) {
    const q = req.query;
    try {
        const pieces = await Piece.getAll(q);
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
})

/** GET /pieces/[pieceID]
 * 
 * RETURNS A PIECE SPECIFIED BY ID
 * 
 * Auth: Ensure Logged in
 */

router.get("/:piece_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const piece = await Piece.getById(req.params.piece_id);
        return res.json({ piece });
    } catch (error) {
        return next(error);
    }
});


module.exports = router; 