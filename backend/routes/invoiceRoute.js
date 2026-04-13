const express = require("express");
const router = express.Router();
const {
  deleteInvoice,
  updateInvoice,
  createInvoice,
  getInvoices,
  downloadInvoice,
  getInv,
  searchInv,
} = require("../controllers/invoiceController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getInvoices);

router.get("/search", auth, searchInv);

router.get("/:id", getInv);


router.post("/", auth, createInvoice);

router.put("/:id", auth, updateInvoice);

router.delete("/:id", auth, deleteInvoice);

router.get("/:id/pdf", auth, downloadInvoice);

module.exports = router;
