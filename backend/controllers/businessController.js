const Business = require("../models/Business");
const Order = require("../models/Order");
const User = require("../models/User");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

exports.upsertBusiness = async (req, res) => {
  try {
    const { businessName, address, phone, gstNumber } = req.body;

    const business = await Business.findOneAndUpdate(
      { user: req.user.id },
      { businessName, address, phone, gstNumber },
      { new: true, upsert: true },
    );

    res.json({
      message: "Business profile saved",
      data: business,
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

exports.createOrder = async (req, res) => {
  try {
    const amount = 299900;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    //  Save in DB
    await Order.create({
      order_id: razorpayOrder.id,
      user: req.user.id,
      amount,
    });

    res.json({
      success: true,
      order: razorpayOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // Find order 
    const order = await Order.findOne({ order_id: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //   CHECK HERE
    if (order.status === "paid") {
      return res.json({
        success: true,
        message: "Already processed",
      });
    }

    //  update order
    order.payment_id = razorpay_payment_id;
    order.signature = razorpay_signature;
    order.status = "paid";

    await order.save();

    // Upgrade user
    await User.findByIdAndUpdate(order.user, {
      isPremium: true,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};