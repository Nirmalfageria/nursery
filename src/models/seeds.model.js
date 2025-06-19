import mongoose, { Schema } from "mongoose";

const seedSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['flower', 'vegetable', 'herb', 'fruit'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  availableTypes: {
    type: [String], // e.g. ['Marigold', 'Sunflower']
    default: [],
  },
  pricePerUnit: {
    type: Number,
    required: true,
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

// ✅ Fix: Prevent model overwrite on hot reloads
const Seed = mongoose.models.Seed || mongoose.model('Seed', seedSchema);

export default Seed;
