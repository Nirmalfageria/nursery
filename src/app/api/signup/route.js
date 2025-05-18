import dbconnect from "../../../db/index";
import { NextResponse } from "next/server";
import User from "../../../models/user.model";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, username, email, phoneNumber, password } = body;
    console.log(fullName,username,email, phoneNumber, password);
    if (!fullName || !username || !password) {
      return NextResponse.json(
        { message: "Full Name, Username, and Password are required", success: false },
        { status: 400 }
      );
    }
    
    if (!email && !phoneNumber) {
      return NextResponse.json(
        { message: "Either Email or Phone number is required", success: false },
        { status: 400 }
      );
    }
    

    await dbconnect();
    console.log("db is connected");

    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
        { phoneNumber: phoneNumber },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.username === username.toLowerCase()
              ? "Username already taken"
              : existingUser.email === email.toLowerCase()
                ? "Email already registered"
                : existingUser.phoneNumber === phoneNumber
                  ? "Phone number already registered"
                  : "Unknown error",
          success: false,
        },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username: username.toLowerCase(),
      password: hashedPassword,
      role: "user",
      isVerified: false,
      ...(email ? { email: email.toLowerCase() } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
    });
    

    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "Registration successful",
        success: true,
        user: {
          id: savedUser._id,
          fullName: savedUser.fullName,
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "Error during registration",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
