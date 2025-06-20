import mongoose, { Schema } from "mongoose";

const fertilizerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['organic', 'chemical', 'bio', 'compound'], // You can customize this list
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  usage: {
    type: [String], // e.g. ['Nitrogen supplement', 'Soil enhancer']
    default: [],
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  priceUnit: {
    type: String,
    enum: ["per gram", "per kg", "per packet", "per liter"],
    default: "per kg",
  },
  imageUrl: {
    type: String,
    default: '',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Prevent overwrite on hot reloads (Next.js)
const Fertilizer = mongoose.models.Fertilizer || mongoose.model('Fertilizer', fertilizerSchema);

export default Fertilizer;
