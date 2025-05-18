import mongoose, { Schema } from "mongoose";

const plantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // URL to the plant image
    required: true
  },
  description: {
    type: String, // Care tips, sunlight, watering
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Flowering", "Fruit", "Seasonal", "Indoor", "Outdoor"],
    required: true
  },
  stock: {
    type: Boolean,
    required: true // Available quantity
  }
}, { timestamps: true });

export default mongoose.models.Plant || mongoose.model("Plant", plantSchema);
