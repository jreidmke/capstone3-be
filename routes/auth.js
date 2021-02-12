/**
 * STILL NEED TO IMPORT jsonSchema for checks
 */

"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const userAuthSchema = require("../schemas/userAuth.json");
const platformRegSchema = require("../schemas/platformReg.json");
const writerRegSchema = require("../schemas/writerReg.json");
const { BadRequestError } = require("../expressError");
const {  ensureCorrectUserOrAdmin } = require("../middleware/auth");

/** POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */


router.post("/login", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
            if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { email, password } = req.body;
        const user = await User.authenticate(email, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
});

// /**POST /auth/register: User must include all properties of 

    // USER TABLE (email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername)

    //And WRITER TABLE (firstName, lastName, age, bio)

    //OR

    //PLATFORM TABLE (handle, description, display_name)

/* Returns JWT token which can be used to authenticate further requests.
  * 
  * Auth required: none
*/

router.post("/register", async function(req, res, next) {
    try {
        let validator;
        if("displayName" in req.body) {
            validator = jsonschema.validate(req.body, platformRegSchema);
        } else {
            validator = jsonschema.validate(req.body, writerRegSchema)
        };
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        };
        const newUser = await User.register({...req.body});
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
