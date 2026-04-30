const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const invoiceRoute = require("./invoiceRoute");
const businessRoute = require("./businessRoute");
const rateLimit = require("express-rate-limit");
const adminRoute = require("./adminRoute");
const messageRoute = require("./messageRoute");

const createLimiter = (windowMs, max) =>
  rateLimit({
    windowMs,
    max,
    message: "Too many requests",
  });

const authLimiter = createLimiter(15 * 60 * 1000, 50);
const invoiceLimiter = createLimiter(1 * 60 * 1000, 60);
const chatLimiter = createLimiter(1 * 60 * 1000, 50);
const adminLimiter = createLimiter(10 * 60 * 1000, 50);

router.use("/auth", authLimiter, authRoute);

router.use("/invoice", invoiceLimiter, invoiceRoute);

router.use("/businessProfile", businessRoute);

router.use("/admin", adminLimiter, adminRoute);

router.use("/message", chatLimiter, messageRoute);

module.exports = router;
