const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();
const Tag = require("./../models/tag");

router.get("/", ensureLoggedIn, async(req, res, next) => {
    const q = req.query;
    try {
        const tags = await Tag.getAll(q);
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
})

module.exports = router;