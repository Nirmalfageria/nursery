// src/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: { type: Number, required: true },
      common_name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
