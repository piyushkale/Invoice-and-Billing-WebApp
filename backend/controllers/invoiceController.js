const Invoice = require("../models/Invoice");
const generateInvoicePdf = require("../utils/generateInvoicePdf");
const { sendInvoiceEmail } = require("../utils/sendInvoiceEmail");
const Business = require("../models/Business");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.createInvoice = async (req, res) => {
  try {
    const { customerName, customerEmail, items } = req.body;

    const totalAmount = items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);

    const invoice = await Invoice.create({
      user: req.user.id,
      customerName,
      customerEmail,
      items,
      totalAmount,
    });
    const link = `http://localhost:3000/invoice.html?id=${invoice._id}`;
    try {
      if (invoice.customerEmail) {
        await sendInvoiceEmail(customerEmail, link);
      }
    } catch (err) {
      console.error("Email failed:", err.message);
    }
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const last30days = new Date();
    last30days.setDate(last30days.getDate() - 30);

    const inv = await Invoice.find({
      user: req.user.id,
      createdAt: { $gte: last30days },
    });
    const count = inv.length;
    const total = inv.reduce((sum, inv) => {
      return sum + inv.totalAmount;
    }, 0);

    const lastYear = new Date();
    lastYear.setDate(lastYear.getDate() - 365);

    const invYear = await Invoice.find({
      user: req.user.id,
      createdAt: { $gte: lastYear },
    });

    const totalYear = invYear.reduce((sum, inv) => {
      return sum + inv.totalAmount;
    }, 0);

    res.json({ invoices, total, totalYear, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInv = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();

    const details = await Business.findOne({ user: invoice.user })
      .select("address businessName phone -_id")
      .lean();
    const pr = await User.findById(invoice.user).select("isPremium").lean();

    details.isPremium = pr.isPremium ?? false;
    
    let token = req.header("Authorization");
    let isOwner = false;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (invoice.user == decoded.id) {
        isOwner = true;
      }
    }

    if (!invoice) return res.status(404).json({ message: "Not found" });

    res.json({ invoice, isOwner, details });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { customerName, items } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) return res.status(404).json({ message: "Not found" });

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (items) {
      invoice.totalAmount = items.reduce((acc, item) => {
        return acc + item.quantity * item.price;
      }, 0);
      invoice.items = items;
    }

    if (customerName) invoice.customerName = customerName;

    await invoice.save();

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) return res.status(404).json({ message: "Not found" });

    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await invoice.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ownership check
    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const business = await Business.findOne({ user: req.user.id });

    generateInvoicePdf(invoice, business || {}, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.searchInv = async (req, res) => {
  try {
    const { q } = req.query;

    const invoices = await Invoice.find({
      user: req.user.id,
      customerName: { $regex: q, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
};
