const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const { customerName, items } = req.body;

    const totalAmount = items.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);

    const invoice = await Invoice.create({
      user: req.user.id,
      customerName,
      items,
      totalAmount
    });

    res.status(201).json(invoice);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(invoices);

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