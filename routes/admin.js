const express = require("express");
const Admin = require('./../models/admin');
const { ensureAdmin } = require("./../middleware/auth");
const router = new express.Router();

router.get("/users", ensureAdmin, async function(req, res, next) {
    try {
        const users = await Admin.getAllUsers();
        return res.json({ users });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;