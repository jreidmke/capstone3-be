"use strict";

const express = require("express");
const router = express.Router();

const Platform = require("../models/platform");
const Gig = require("../models/gig");
const Application = require("../models/application");

const jsonschema = require("jsonschema");
const createGig = require("./../schemas/createGig.json");
const updateGig = require("./../schemas/updateGig.json");
const updatePlatform = require("./../schemas/updatePlatform.json");
const platformQP = require("../schemas/writerQP.json");

const { ensureLoggedIn, ensureCorrectPlatformOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

//PLATFORM STUFF//

/** GET /  =>
 *   { companies: [ { displayname, imageurl, city, state, facebookusername, twitterusername, youtubeusername }, ...] }
 *
 * GET ALL PLATFORMS
 *
 * Authorization required: Logged In
 */

router.get("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.query, platformQP);
        if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
        }
        const platforms = await Platform.getAll(req.query);
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    }
});

/** GET /platforms/[platformId]  =>
 *   { platform: { displayname, imageurl, city, state, facebookusername, twitterusername, youtubeusername } }
 *
 * GET PLATFORM SPECIFIED BY ID
 *
 * Authorization required: Logged In
 */

router.get("/:platform_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const platform = await Platform.getById(req.params.platform_id, "platform");
        return res.json({ platform });
    } catch (error) {
        return next(error);
    }
});

/** PATCH /platforms/[platformId] { fld1, fld2, ... } => { updatedPlatform: {platformData} }
 *
 * UPDATES SPECIFIED PLATFORM
 * 
 * Also Updates Connected User Row
 *
 * Authorization required: admin
 */

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

/** DELETE /  =>
 *   { deleted: "deleted" }
 *
 * DELETE PLATFORM PLATFORM SPECIFIED BY ID
 *
 * Authorization required: Admin or Correct Platform
 */

router.delete("/:platform_id", ensureCorrectPlatformOrAdmin, async(req, res, next) => {
    try {
        const deleted = await Platform.remove(req.params.platform_id);
        return res.json({ deleted });
    } catch (error) {
        return next(error);
    }
});

//FOLLOWS//

/**GET /platforms/[platformId]/follow_tags => {id, platformId, tagId, createdAt, updatedAt, title, isFiction} 
 * 
 * GET ALL TAGS FOLLOWED BY PLATFORM
 * 
 * Auth: correct platform or admin
*/

router.get("/:platform_id/followed_tags", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const tags = await Platform.getFollows(req.params.platform_id, "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

/**POST /platforms/[platformId]/followed_tags/[tagId] => {platformId, tagId} 
 * 
 * PLATFORM FOLLOWS NEW TAG
 * 
 * Auth: correct platform or admin
*/

router.post("/:platform_id/followed_tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /platforms/[platformId]/followed_tags/[tagId] => {platformId, tagId} 
 * 
 * PLATFORM UNFOLLOWS TAG
 * 
 * Auth: correct platform or admin
*/

router.delete("/:platform_id/followed_tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.tag_id, "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

/**GET /platforms/[platformId]/follow_writers => {id, platformId, writerId, createdAt, updatedAt, firstName, lastName, age, bio} 
 * 
 * GET ALL TAGS FOLLOWED BY PLATFORM
 * 
 * Auth: correct platform or admin
*/

router.get("/:platform_id/followed_writers", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const writers = await Platform.getFollows(req.params.platform_id, "writer");
        return res.json({ writers });
    } catch (error) {
        return next(error);
    };
});

/**POST /platforms/[platformId]/followed_writers/[writerId] => {platformId, writerId} 
 * 
 * PLATFORM FOLLOWS NEW WRITER
 * 
 * Auth: correct platform or admin
*/

router.post("/:platform_id/followed_writers/:writer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const followed = await Platform.followItem(req.params.platform_id, req.params.writer_id, "writer");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /platforms/[platformId]/followed_writers/[writerId] => {platformId, tagId} 
 * 
 * PLATFORM UNFOLLOWS WRITER
 * 
 * Auth: correct platform or admin
*/

router.delete("/:platform_id/followed_writers/:writer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await Platform.unfollowItem(req.params.platform_id, req.params.writer_id, "writer");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

//GIG STUFF

/**POST /platforms/[platformId]/gigs/new, {title, description, compensation, isRemote, wordCount}
 * 
 * CREATE NEW GIG
 * 
 * Returns: {title, description, compensation, isRemote, wordCount}
 * 
 * Auth: Correct platform or admin
 */

router.post("/:platform_id/gigs/new", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const q = req.body;
        if(q.compensation !== undefined) q.compensation = +q.compensation;
        if(q.wordCount !== undefined) q.wordCount = +q.wordCount;
        q.isRemote = q.isRemote === "true";
        q.isActive = q.isActive === "true";

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

/**PATCH /platforms/[platformId]/gigs, {title, description, compensation, isRemote, wordCount}
 * 
 * UPDATES GIG
 * 
 * Returns: {title, description, compensation, isRemote, wordCount}
 * 
 * Auth: Correct platform or admin
 */

router.patch("/:platform_id/gigs/:gig_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const q = req.body;
        if(q.compensation !== undefined) q.compensation = +q.compensation;
        if(q.wordCount !== undefined) q.wordCount = +q.wordCount;
        q.isRemote = q.isRemote === "true";
        q.isActive = q.isActive === "true";
           
        const validator = jsonschema.validate(req.body, updateGig);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        };
        const updatedGig = await Gig.update(req.params.platform_id, req.params.gig_id, q);
        return res.json({ updatedGig });
    } catch (error) {
        return next(error);
    }
});


/**DELETE /platforms/[platformId]/gigs
 * 
 * DELETE GIG
 * 
 * Returns: {"deleted"}
 * 
 * Auth: Correct platform or admin
 */

router.delete("/:platform_id/gigs/:gig_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const deletedGig = await Gig.removeGig(req.params.platform_id, req.params.gig_id);
        return res.status(201).json({ deletedGig });
    } catch (error) {
        return next(error);
    }
});

/**POST /platforms/[platformId]/gigs/[gigId]/writers/[writerId] 
 * 
 * MAKE AN QUERY
 * 
 * Returns: {writerId, platformId, gigId, createdAt}
 * 
 * Auth: Correct Platform or admin
*/

router.post("/:platform_id/gigs/:gig_id/writers/:writer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const newQuery = await Gig.makeQuery(req.params.platform_id, req.params.gig_id, req.params.writer_id, req.body.message);
        return res.json({ newQuery });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /platforms/[platformId]/offers/[offerId]
 * 
 * REVOKE OFFER
 * 
 * Returns {writer_id, platform_id, gig_id, created_at, id}
 * 
 * Auth: Correct Platform or admin
 */
router.delete("/:platform_id/offers/:offer_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const revokedOffer = await Gig.revokeOffer(req.params.offer_id);
        return res.json({ revokedOffer });
    } catch (error) {
        return next(error);
    }
})

//GIG TAGGING//

/**POST /platforms/[platformId]/gigs/[gigId]/tags/[tagId] => {gigId, tagId} 
 * 
 * NEW TAG ADDED TO GIG
 * 
 * Auth: correct platform or admin
*/

router.post("/:platform_id/gigs/:gig_id/tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const newTag = await Gig.addTagToGig(req.params.platform_id, req.params.gig_id, req.params.tag_id);
        return res.json({ newTag });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /platforms/[platformId]/gigs/[gigId]/tags/[tagId] => {gigId, tagId} 
 * 
 * TAG REMOVED FROM GIG
 * 
 * Auth: correct platform or admin
*/

router.delete("/:platform_id/gigs/:gig_id/tags/:tag_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const removedTag = await Gig.removeTagFromGig(req.params.platform_id, req.params.gig_id, req.params.tag_id);
        return res.json({ removedTag });
    } catch (error) {
        return next(error);
    }
});

//APPLICATION STUFF//

/**GET /platforms/[platformId]/gigs/[gigId]/applications => {gigId, writerId, portfolioId, status, createdAt, updatedAt}
 * 
 * GET ALL APPLICATIONS BY GIG ID
 * 
 * Auth: correct platform or admin
*/

router.get("/:platform_id/gigs/:gig_id/applications", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const apps = await Application.getByUserId(req.params.gig_id, 'gig');
        return res.json({ apps });
    } catch (error) {
        return next(error);
    }
});

//GET APPLICATIONS BY PLATFORM ID
router.get("/:platform_id/applications", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const apps = await Application.getByPlatformId(req.params.platform_id);
        return res.json({ apps });
    } catch (error) {
        return next(error);
    }
})

/**PATCH /platforms/[platformId]/gigs/[gigId]/applications/[applicationId], {status} => {gigId, writerId, portfolioId, status, createdAt, updatedAt}
 * 
 * UPDATE STATUS OF APPLICATION SPECIFIED BY ID
 * 
 * Auth: correct platform or admin
*/

router.patch("/:platform_id/applications/:application_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const {status} = req.body;
        if(status==="Accepted" || status==="Pending" || status==="Rejected") {
            const app = await Application.setApplicationStatus(req.params.application_id, req.body.status);
            return res.json({ app });
        } throw new BadRequestError('Status must be Sting: "Accepted", "Rejected" or "Pending".');
    } catch (error) {
        return next(error);
    }
});

router.get("/:platform_id/applications/:application_id", ensureCorrectPlatformOrAdmin, async function(req, res, next) {
    try {
        const app = await Application.getById(req.params.platform_id, req.params.application_id);
        return res.json({ app });
    } catch (error) {
        return next(error);
    }
});

//FEED STUFF

router.get("/:platform_id/feed/tags/", ensureCorrectPlatformOrAdmin, async(req, res, next) => {
    try {
        const gigs = await Platform.getPiecesForFeedFromTags(req.query.tag_ids);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

router.get("/:platform_id/feed/writers/", ensureCorrectPlatformOrAdmin, async(req, res, next) => {
    try {
        const gigs = await Platform.getPiecesForFeedFromWriters(req.query.writer_ids);
        return res.json({ gigs });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;