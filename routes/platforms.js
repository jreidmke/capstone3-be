"use strict";

const express = require("express");
const User = require("../models/user");
const Platform = require("../models/platform");
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
        const tags = await User.getItemFollows(req.params.id, "platform", "tag");
        return res.json({ tags });
    } catch (error) {
        return next(error);
    }
});

/**POST /[id]/followed_tags/[tag_id] => {followed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
*/

router.post("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await User.followItem(req.params.id, req.params.tag_id, "writer", "tag");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
});

/**DELETE /[id]/followed_tags/[tag_id] => {unfollowed: {userID, tagId, tagTitle}}
 *
 * Auth: admin or correct user
 */

router.delete("/:id/followed_tags/:tag_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await User.unfollowItem(req.params.id, req.params.tag_id, "writer", "tag");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
})

/**GET /[id]/followed_platforms => [{id, writer_id, tag_id, timestamps},...]
 *
 * Auth: admin or correct user
 */

router.get("/:id/followed_platforms", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const platforms = await User.getItemFollows(req.params.id, "writer", "platform");
        return res.json({ platforms });
    } catch (error) {
        return next(error);
    };
});

/**POST /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.post("/:id/followed_platforms/:platform_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const followed = await User.followItem(req.params.id, req.params.platform_id, "writer", "platform");
        return res.json({ followed });
    } catch (error) {
        return next(error);
    }
})

/**DELETE /[username]/followed_platforms/:platformHandle
 *
 * Auth: admin or correct user
 */

router.delete("/:id/followed_platforms/:platform_id", ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const unfollowed = await User.unfollowItem(req.params.id, req.params.platform_id, "writer", "platform");
        return res.json({ unfollowed });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;

// PLATFORM ROUTES



// //PLATFORMS//




// GET /platforms
// Shows a list of platforms

// GET /platforms/:platform_name
// Returns data on specified platform

// GET /platforms/:platform_name/edit (FRONT END ROUTE)
// ONLY viewable by admin/platform
// Shows platform edit form

// PATCH /platforms/:platform_name/edit
// Sends patch request to update platform in db

// DELETE /platforms/:platform_name
// ONLY viewable by admin/platform
// Deletes platform from db (also deletes all gigs and applications connected to platform)



//FOLLOWS//



// GET /platforms/:platform_name/followed_tags
// Shows a list of followed tags and other tags to follow if you click on the icon. (*SEE WRITER ROUTING FOR SIMILAR EXAMPLES)

// POST /platforms/:platform_name/followed_tags/:tag_title
// Adds tag title and platform name to PLATFORM_FOLLOWS_TAG db

// DELETE /platforms/:platform_name/followed_tags/:tag_title
// Removes tag title and platform name from PLATFORM_FOLLOWS_TAG db

// GET /platforms/:platform_name/followed_writers
// Shows a list of followed writers

// POST /platforms/:platform_name/followed_writers/:writer_username
// Adds tag title and writer username to PLATFORM_FOLLOWS_WRITER db

// DELETE /platforms/:platform_name/followed_writers/:writer_username
// Removes tag title and writer username from PLATFORM_FOLLOWS_WRITER db




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