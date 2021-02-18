const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const Piece = require("../models/piece");

/** GET /pieces =>
 *   { jobs: [ { id, writerId, title, text, createdAt }, ...] }
 *
 * GET ALL GIGS
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

module.exports = router; 