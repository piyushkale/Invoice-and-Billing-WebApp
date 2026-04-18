const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const invoiceRoute = require("./invoiceRoute");
const businessRoute = require("./businessRoute");
const adminRoute = require("./adminRoute");

router.use("/auth", authRoute);

router.use("/invoice", invoiceRoute);

router.use("/businessProfile", businessRoute);

router.use("/admin", adminRoute);

module.exports = router;
