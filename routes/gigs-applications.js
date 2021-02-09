// GIGS ROUTES
const express = require("express");
const Gig = require("./../models/gig");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /gigs
// Shows a list of all gigs
router.get("/", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getAll();
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

// GET /gigs/:gig_id
// Shows detail on specified gig
router.get("/:id", ensureLoggedIn, async(req, res, next) => {
    try {
        const gig = await Gig.getById(req.params.id);
        return res.json({ gig });
    } catch (error) {
        return next(error);
    }
})

// GET /gigs/tags/tag_title
//Shows a list of gigs by tag
router.get("/tags/:tag_title", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getByTagTitle(req.params.tag_title);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

//GET /gigs/platforms/:id
//Shows a list of gigs by platform id
router.get("/platforms/:platform_id", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getByPlatformId(req.params.platform_id);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
})

// GET /gigs/:gig_id/apply
// Shows apply to gig form

// POST /gigs/:gig_id/apply
// Adds writer username, portfolio id and other data to APPLICATION DB.
//This will also make use of **userContext** to pass in the correct data for user.

// DELETE /gigs/:gig_id/apply
// Withdraws application
//This will also make use of **userContext** to pass in the correct data for user.
module.exports = router;