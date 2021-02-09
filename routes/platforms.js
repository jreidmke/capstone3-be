"use strict";

const express = require("express");
const User = require("../models/user");
const Platform = require("../models/platform");
const Follow = require("../models/follow");
const Gig = require("../models/gig");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const platforms = await Platform.getAll();
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    }
});

router.get("/:id", ensureLoggedIn, async function(req, res, next) {
    try {
        const platform = await User.getById(req.params.id, "platform");
        return res.json({ platform });
    } catch (error) {
        return next(error);
    }
});


// PATCH /writers/writer username/edit
// Only viewable by admin/username
// Sends request to update write data in database

router.get("/:id/followed_tags", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const tags = await Follow.getItemFollows(req.params.id, "platform", "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

router.post("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Follow.followItem(req.params.id, req.params.tag_id, "platform", "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Follow.unfollowItem(req.params.id, req.params.tag_id, "platform", "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

router.get("/:id/followed_writers", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const writers = await Follow.getItemFollows(req.params.id, "platform", "writer");
        return res.json({ writers });
    } catch (error) {
        return next(error);
    };
});

router.post("/:id/followed_writers/:writer_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Follow.followItem(req.params.id, req.params.writer_id, "platform", "writer");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

router.delete("/:id/followed_writers/:writer_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Follow.unfollowItem(req.params.id, req.params.writer_id, "platform", "writer");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

//GIG STUFF
router.post("/:id/gigs", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const newGig = await Gig.createGig(req.params.id, {...req.body});
        return res.status(201).json({ newGig });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id/gigs/:gig_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const deletedGig = await Gig.removeGig(req.params.id, req.params.gig_id);
        return res.status(201).json({ deletedGig });
    } catch (error) {
        return next(error);
    }
})

module.exports = router;

// PLATFORM ROUTES

// //GIGS//

// GET /platforms/:platform_name/gigs
// Shows a list of gigs from platform
// NOTE: Clicking on these routes will not take you to `/platforms/:platform_name/gigs/:gig_id`. It will take you to `/gigs/:gig_id`.

// GET /platforms/:platform_name/gigs/new_gig (FRONT END ROUTE)
// Shows form to create new gig

// POST /platforms/:platform_name/gigs/new_gig
// Creates new gig and commits it to Gigs DB.

// GET /platforms/:platform_name/gigs/:gig_id/edit
// ONLY viewable by admin/platform
// Shows form to edit gig data

// PATCH /platforms/:platform_name/gigs/:gig_id/edit
// ONLY viewable by admin/platform
// Commits edits to gigs database

// DELETE /platforms/:platform_name/gigs/:gig_id
// ONLY viewable by admin/platform
// Deletes gig from DB (also deletes all connected applications).




// //APPLICATIONS//




// GET /platforms/:platform_name/gigs/:gig_id/applications
// Shows a list of applications.

// GET /platforms/:platform_name/gigs/:gig_id/applications/:app_id
// Shows data on one application (including submitted portfolio).

// PATCH /platforms/:platform_name/gigs/:gig_id/applications/
// Sets is_active for all applications for gig to either True or False.