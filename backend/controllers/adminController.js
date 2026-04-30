const User = require("../models/User");
const Invoice = require("../models/Invoice");

exports.getBusinessStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const st = ["approved", "pending", "rejected", "banned"];
    if (!status || !st.includes(status)) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    const result = await User.find({ status, role: "user" })
      .select("name email status")
      .lean();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const { query } = req.query;

    const result = await User.find({
      role: "user",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name email status")
      .limit(10)
      .lean();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBusinessStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !["approved", "rejected", "banned"].includes(status)) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    ).select("name email status");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyticalData = async (req, res) => {
  try {
    // get top user (max Invoices)
    const result = await Invoice.aggregate([
      { $group: { _id: "$user", totalInvoices: { $sum: 1 } } },
      { $sort: { totalInvoices: -1 } },
      { $limit: 1 },
    ]);

    const topUser = await User.findById(result[0]._id).select("name").lean();

    const dateNow = new Date();
    const last30Days = dateNow.setDate(dateNow.getDate() - 30);
    const total30DayInvoices = await Invoice.countDocuments({
      createdAt: { $gte: last30Days },
    });
    const premiumUsersCount = await User.countDocuments({ isPremium: true });
    const totalUsers = await User.countDocuments({ role: "user" });
    const rejectedUsers = await User.countDocuments({ status: "rejected" });
    const bannedUsers = await User.countDocuments({ status: "banned" });

    res.status(200).json({
      topUser,
      total30DayInvoices,
      totalUsers,
      premiumUsersCount,
      rejectedUsers,
      bannedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
