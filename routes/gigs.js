// GIGS ROUTES
const express = require("express");
const router = express.Router();

const Gig = require("../models/gig");
const Application = require("../models/application");

const jsonschema = require("jsonschema");
const applyToGig = require("./../schemas/applyToGig.json");

const { ensureLoggedIn, ensureCorrectWriterOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");


/** GET /gigs =>
 *   { jobs: [ { id, title, description, compensation, isRemote, wordCount, isActive, createdAt, updatedAt }, ...] }
 *
 * GET ALL GIGS
 * 
 * Authorization required: Logged In
 */

router.get("/", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getAll();
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

/** GET /gigs/[gigId] => { id, title, description, compensation, isRemote, wordCount, isActive, createdAt, updatedAt }
 * 
 * GET GIGS AS SPECIFIED BY GIG ID
 * 
 * Authorization required: Logged In
 */

router.get("/:id", ensureLoggedIn, async(req, res, next) => {
    try {
        const gig = await Gig.getById(req.params.id);
        return res.json({ gig });
    } catch (error) {
        return next(error);
    }
})

/** GET /gigs/[tagTitle] => [{ id, title, description, compensation, isRemote, wordCount, isActive, createdAt, updatedAt }, ...]
 * 
 * GET GIGS AS SPECIFIED BY TAG TITLE
 * 
 * Authorization required: Logged In
 */

router.get("/tags/:tag_title", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getByTagTitle(req.params.tag_title);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

/** GET /gigs/[platformId] => [{ id, title, description, compensation, isRemote, wordCount, isActive, createdAt, updatedAt }, ...]
 * 
 * GET GIGS AS SPECIFIED BY PLATFORM ID
 * 
 * Authorization required: Logged In
 */

router.get("/platforms/:platform_id", ensureLoggedIn, async(req, res, next) => {
    try {
        const gigs = await Gig.getByPlatformId(req.params.platform_id);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

// APPLICATION STUFF//

/** POST /gigs/[gigid]/apply/writers/[writerId], { portfolioId }
 *
 * APPLY TO JOB
 * 
 * Returns  {applied: { gigId, writerId, portfolioId }}
 *
 * Authorization required: admin or correct writer
 * */

router.post("/:gig_id/apply/writers/:writer_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, applyToGig);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const applied = await Application.submitApplication(req.params.writer_id, req.params.gig_id, req.body.portfolioId);
        return res.json({ applied });
    } catch (error) {
        return next(error);
    }
});

/** DELETE /gigs/[gigId]/apply/writers/[writerId]  => {app: {Application Withdrawn}}
 *
 * WITHDRAW APPLICATION
 * 
 * Authorization required: admin or correct writer
 */


router.delete("/:gig_id/apply/writers/:writer_id", ensureCorrectWriterOrAdmin, async function(req, res, next) {
    try {
        const app = await Application.withdrawlApplication(req.params.gig_id, req.params.writer_id);
        return res.json({ app });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;