const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

router.use(adminAuth);

// API to get pending approvals

// API to get approvad businesses

// API to get Rejected businesses

// API to get Banned businesses

// API to accept Approval or Rejection of business registration

// API to ban Existing business

// API to get Analytical data

// Search
module.exports = router;
