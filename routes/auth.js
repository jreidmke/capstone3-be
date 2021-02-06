/**
 * STILL NEED TO IMPORT jsonSchema for checks
 * 
 * 
 * POST ("/writers/register")
 * Will add new writer to DB and return token to Login
 * 
 * POST("/platforms/token")
 * WILL return token allowing platform to Login
 * 
 * POST ("/platforms/register")
 * WILL add new platform to DB and return token to Login
 */
"use strict";

const jsonschema = require("jsonschema");
const Writer = require("../models/writer");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressError");

/**POST /writers/login: {username, password} => {token}
 * 
 * Returns JWT used to auth further reqs.
 * 
 * Auth required: none
 */

router.post("/writers/login", async function(req, res, next) {
    try {
        //need to add json schema validators
        //add check for json schema
        //throw error if fails

        const { username, password } = req.body;
        const user = await Writer.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
})

module.exports = router;
