const express = require("express");
const router = express.Router();
const {
  deleteInvoice,
  updateInvoice,
  createInvoice,
  getInvoices,
  downloadInvoice
} = require("../controllers/invoiceController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getInvoices);

router.post("/", auth, createInvoice);

router.put("/:id", auth, updateInvoice);

router.delete("/:id", auth, deleteInvoice);

router.get('/:id/pdf', auth, downloadInvoice);

module.exports = router;
