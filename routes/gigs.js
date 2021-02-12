// GIGS ROUTES
const express = require("express");

const Gig = require("../models/gig");
const Application = require("../models/application");

const jsonschema = require("jsonschema");
const applyToGig = require("./../schemas/applyToGig.json");

const { ensureLoggedIn, ensureCorrectWriterOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

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
});

//Apply to gig
router.post("/:gig_id/apply/writers/:writer_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, applyToGig);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const app = await Application.submitApplication(req.params.writer_id, req.params.gig_id, req.body.portfolioId);
        return res.json({ app });
    } catch (error) {
        return next(error);
    }
});

router.delete("/:gig_id/apply/writers/:writer_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const app = await Application.withdrawlApplication(req.params.gig_id, req.params.writer_id);
        return res.json({ app });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;