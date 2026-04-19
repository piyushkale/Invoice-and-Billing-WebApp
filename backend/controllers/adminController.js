const User = require("../models/User");

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
