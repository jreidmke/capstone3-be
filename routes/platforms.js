"use strict";

const express = require("express");
const User = require("../models/user");
const Platform = require("../models/platform");
const Follow = require("../models/follow");
const Gig = require("../models/gig");
const { ensureLoggedIn, ensureCorrectUserOrAdmin, ensureCorrectPlatformOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const platforms = await Platform.getAll();
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    }
});

router.get("/:platform_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const platform = await User.getById(req.params.platform_id, "platform");
        return res.json({ platform });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:platform_id", ensureCorrectPlatformOrAdmin, async(req, res, next) => {
    try {
        const deleted = await Platform.remove(req.params.platform_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
});

//FOLLOW TAGS
router.get("/:platform_id/followed_tags", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const tags = await Platform.getFollows(req.params.platform_id, "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

router.post("/:platform_id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:platform_id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

router.get("/:platform_id/followed_writers", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const writers = await Platform.getFollows(req.params.platform_id, "writer");
        return res.json({ writers });
    } catch (error) {
        return next(error);
    };
});

router.post("/:platform_id/followed_writers/:writer_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.writer_id, "writer");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

router.delete("/:platform_id/followed_writers/:writer_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.writer_id, "writer");
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
});

module.exports = router;