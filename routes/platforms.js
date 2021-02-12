"use strict";

const express = require("express");
const User = require("../models/user");
const Platform = require("../models/platform");
const Gig = require("../models/gig");
const Application = require("../models/application");
const jsonschema = require("jsonschema");
const createGig = require("./../schemas/createGig.json");
const updateGig = require("./../schemas/updateGig.json");
const updatePlatform = require("./../schemas/updatePlatform.json");
const { ensureLoggedIn, ensureCorrectPlatformOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

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

router.patch("/:platform_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updatePlatform);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { platformData, userData } = req.body;
        const updatedPlatform = await Platform.update(req.params.platform_id, platformData, userData);
        return res.json({ updatedPlatform });
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
router.get("/:platform_id/followed_tags", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const tags = await Platform.getFollows(req.params.platform_id, "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

router.post("/:platform_id/followed_tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:platform_id/followed_tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

//FOLLOWED WRITERS

router.get("/:platform_id/followed_writers", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const writers = await Platform.getFollows(req.params.platform_id, "writer");
        return res.json({ writers });
    } catch (error) {
        return next(error);
    };
});

router.post("/:platform_id/followed_writers/:writer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.writer_id, "writer");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:platform_id/followed_writers/:writer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.writer_id, "writer");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

//GIG STUFF

router.get("/:platform_id/gigs", ensureLoggedIn, async function(req, res, next) {
    try {
        const gigs = await Gig.getByPlatformId(req.params.platform_id);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
})

//POST NEW GIG

router.post("/:platform_id/gigs/new", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, createGig);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const newGig = await Gig.createGig(req.params.platform_id, {...req.body});
        return res.status(201).json({ newGig });
    } catch (error) {
        return next(error);
    }
});

router.patch("/:platform_id/gigs/:gig_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateGig);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        };
        const updatedGig = await Gig.update(req.params.platform_id, req.params.gig_id, req.body);
        return res.json({ updatedGig });
    } catch (error) {
        return next(error);
    }
})


router.delete("/:platform_id/gigs/:gig_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const deletedGig = await Gig.removeGig(req.params.platform_id, req.params.gig_id);
        return res.status(201).json({ deletedGig });
    } catch (error) {
        return next(error);
    }
});

router.post("/:platform_id/gigs/:gig_id/tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const newTag = await Gig.addTagToGig(req.params.platform_id, req.params.gig_id, req.params.tag_id);
        return res.json({ newTag });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:platform_id/gigs/:gig_id/tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const newTag = await Gig.removeTagFromGig(req.params.platform_id, req.params.gig_id, req.params.tag_id);
        return res.json({ newTag });
    } catch (error) {
        return next(error);
    }
});

//Application Stuff

router.get("/:platform_id/gigs/:gig_id/applications", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const apps = await Application.getByUserId(req.params.gig_id, 'gig');
        return res.json({ apps });
    } catch (error) {
        return next(error);
    }
});

//UPDATE APPLICATION STATUS

router.patch("/:platform_id/gigs/:gig_id/applications/:application_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const {status} = req.body;
        if(status==="Accepted" || status==="Pending" || status==="Rejected") {
            const app = await Application.setApplicationStatus(req.params.application_id, req.body.status);
            return res.json({ app });
        } throw new BadRequestError('Status must be Sting: "Accepted", "Rejected" or "Pending".');
    } catch (error) {
        return next(error);
    }
})

module.exports = router;