const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  upsertBusiness,
  getBusiness,
  createOrder,
  verifyPayment,
} = require("../controllers/businessController");

router.post("/", auth, upsertBusiness);
router.get("/", auth, getBusiness);

router.post("/create-order", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment);

module.exports = router;
