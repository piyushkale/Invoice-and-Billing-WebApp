const User = require("../models/User");

exports.getBusinessStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const st = ["approved", "pending", "rejected", "banned"];
    if (!status || !st.includes(status)) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    const result = await User.find({ status,role:"user" })
      .select("name email status")
      .lean();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
