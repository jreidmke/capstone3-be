const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectPlatformOrAdmin } = require("../middleware/auth");
const Piece = require("../models/piece");

router.get("/", async function(req, res, next) {
    const q = req.query;
    if(q.maxWordCount !== undefined) q.maxWordCount = +q.maxWordCount;
    if(q.minWordCount !== undefined) q.minWordCount = +q.minWordCount;
    try {
        const pieces = await Piece.getAll(q);
        return res.json({ pieces });
    } catch (error) {
        return next(error);
    }
})

module.exports = router; 