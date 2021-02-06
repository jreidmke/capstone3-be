/**
 * STILL NEED TO IMPORT jsonSchema for checks


 * POST("/platforms/token")
 * WILL return token allowing platform to Login
 * 
 * POST ("/platforms/register")
 * WILL add new platform to DB and return token to Login
 */
"use strict";

const jsonschema = require("jsonschema");
const Writer = require("../models/writer");
const Platform = require("../models/platform");
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
});

/**POST /writers/register: user must include all WRITER PROPERTIES except is_admin, and bio => { token } 
 * 
 * Returns JWT used to auth further reqs.
 * 
 * Auth required: none
*/

router.post("/writers/register", async function(req, res, next) {
    try {
        //again, JSON SCHEMA VALIDATORS

        const newUser = await Writer.register({...req.body, isAdmin: false});
        const token = createToken(newUser);
        return res.status(201).json({ token }); 
    } catch (error) {
        return next(error);
    }
}); 

/**POST /platforms/login: {username, password} => {token}
 * 
 * Returns JWT used to auth further reqs.
 * 
 * Auth required: none
 */

router.post("/platforms/login", async function(req, res, next) {
    try {
        //JSON SCHEMA VALIDATION

        const { username, password } = req.body;
        const user = await Platform.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    };
}); 

/**POST /platforms/register: user must include all PLATFORM PROPERTIES except is_admin, and description => { token }
 * 
 * Returns JWT used to auth further reqs.
 * 
 * Auth required: none
*/

router.post("/platforms/register", async function(req, res, next) {
    try {
        //JSON SCHEMA VALIDATION
        const newPlatform = await Platform.register({...req.body, isAdmin: false});
        const token = createToken(newPlatform);
        return res.status(201).json({ token }); 
    } catch (error) {
        return next(error);
    };
});

module.exports = router;
