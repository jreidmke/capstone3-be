"use strict";

/**EXPRESS APP FOR PRINT */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const Writer = require("./models/writer");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const writerRoutes = require("./routes/writers");
const platformRoutes = require("./routes/platforms");
const gigRoutes = require("./routes/gigs");
const tagRoutes = require("./routes/tags");
const pieceRoute = require("./routes/pieces");
const portfolioRoute = require("./routes/portfolios");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/writers", writerRoutes);
app.use("/platforms", platformRoutes);
app.use("/gigs", gigRoutes);
app.use("/tags", tagRoutes);
app.use("/pieces", pieceRoute);
app.use("/portfolios", portfolioRoute);

app.get("/", async function(req, res, next) {
  const result = await Writer.getAll();
  console.log(result);
  return res.json({result});
})

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });

  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
      error: { message, status },
    });
  });

  module.exports = app;