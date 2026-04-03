const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const invoiceRoute = require("./invoiceRoute");
const businessRoute = require("./businessRoute");

router.use("/auth", authRoute);

router.use("/invoice", invoiceRoute);

router.use("/businessProfile", businessRoute);

module.exports = router;
