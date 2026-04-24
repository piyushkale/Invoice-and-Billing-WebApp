const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { getAllBusinesses,getBusinessStatus,updateBusinessStatus } = require("../controllers/adminController");

router.use(adminAuth);

// get businesses based on their status
router.get("/businessStatus", getBusinessStatus);

// Search results
router.get("/search",getAllBusinesses)

// API to accept Approval or Rejection of business registration
router.put("/updateStatus", updateBusinessStatus);
// API to ban Existing business

// API to get Analytical data

// Search
module.exports = router;
