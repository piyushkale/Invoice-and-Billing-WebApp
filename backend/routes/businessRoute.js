const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  upsertBusiness,
  getBusiness,
} = require("../controllers/businessController");

router.post("/", auth, upsertBusiness);
router.get("/", auth, getBusiness);

module.exports = router;
