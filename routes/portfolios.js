const Portfolio = require("../models/portfolio");
const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /writers/[writerId]/portfolios/[portfolioId]
 * 
 * RETURNS A PORTFOLIO SPECIFIED BY ID
 * 
 * Auth: Ensure Logged in
 */

router.get("/:portfolio_id", ensureLoggedIn, async function(req, res, next) {
    try {
        const portfolio = await Portfolio.getById(req.params.portfolio_id);
        return res.json({ portfolio });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;