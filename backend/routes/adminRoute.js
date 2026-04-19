const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {getBusinessStatus} = require('../controllers/adminController')

router.use(adminAuth);

// get businesses based on their status
router.get("/businessStatus", getBusinessStatus);

// API to accept Approval or Rejection of business registration

// API to ban Existing business

// API to get Analytical data

// Search
module.exports = router;
