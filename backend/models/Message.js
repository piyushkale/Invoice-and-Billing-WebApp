const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    senderType: {
      type: String,
      enum: ["businessOwner", "customer"],
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for customer
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);