import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    match: [
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },

  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters"],
    // not required for mobile OTP login
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
