const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();
const Tag = require("./../models/tag");

router.get("/", ensureLoggedIn, async function(req, res, next) {
    const q = req.query;
    let tags;
    if(q.fiction || q.search) {
        try {
            if(q.fiction) {
                if(q.fiction === "true") {
                    tags = await Tag.getByIsFiction(true);
                } else if(q.fiction === "false") {
                    tags = await Tag.getByIsFiction(false);
                } else {
                    throw new BadRequestError("Fiction query must equal 'true' or 'false'.");
                };
            } else if(q.search) {
                tags = await Tag.getBySearch(q.search);
            } else {
                throw new BadRequestError("Query Must be either 'search' or fiction'");
            }
            return res.json({ tags });
        } catch (error) {
            return next(error);
        }
    }
    try {
        tags = await Tag.getAll();
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;