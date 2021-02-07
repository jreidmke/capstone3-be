/**
 * STILL NEED TO IMPORT jsonSchema for checks
 */

"use strict";

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressError");

/**POST /login: {email, password} => {token}
 * 
 * Returns JWT used to auth further reqs.
 * 
 * Auth required: none
 */

router.post("/login", async function(req, res, next) {
    try {
        //need to add json schema validators
        //add check for json schema
        //throw error if fails

        const { email, password } = req.body;
        const user = await User.authenticate(email, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
});

// /**POST /register: user must include all properties of 

    // USER TABLE (email, password, imageUrl, address1, address2, city, state, postalCode, phone, twitterUsername, facebookUsername, youtubeUsername)

    //And WRITER TABLE (firstName, lastName, age, bio)

    //OR

    //PLATFORM TABLE (handle, description, display_name)

/* Returns JWT used to auth further reqs.
  * 
  * Auth required: none
*/

router.post("/register", async function(req, res, next) {
    try {
        //json schema validators
        const newUser = await User.register({...req.body});
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
})

module.exports = router;
