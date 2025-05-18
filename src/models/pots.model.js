import mongoose, { Schema } from "mongoose";

const potSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // URL to the pot image
    required: true
  },
  description: {
    type: String, // Material, size, shape, features
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  material: {
    type: String,
    enum: ["Ceramic", "Plastic", "Terracotta", "Metal", "Concrete", "Wood"],
    required: true
  },
  size: {
    type: String,
    enum: ["Small", "Medium", "Large", "Extra Large"],
    required: true
  },
  stock: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Pot || mongoose.model("Pot", potSchema);
