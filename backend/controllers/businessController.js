const Business = require('../models/Business');

exports.upsertBusiness = async (req, res) => {
  try {
    const { businessName, address, phone, gstNumber } = req.body;

    const business = await Business.findOneAndUpdate(
      { user: req.user.id },
      { businessName, address, phone, gstNumber },
      { new: true, upsert: true }
    );

    res.json({
      message: "Business profile saved",
      data: business
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user.id });

    if (!business) {
      return res.status(404).json({ message: "No business profile" });
    }

    res.json(business);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};