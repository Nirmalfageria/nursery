import dbconnect from "../../../db/index";
import { NextResponse } from "next/server";
import User from "../../../models/user.model";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, username, email, password } = body;

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    await dbconnect();
    console.log("db is connected");

    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: existingUser.username === username.toLowerCase()
            ? "Username already taken"
            : "Email already registered",
          success: false
        },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      isVerified: false
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
          email: savedUser.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "Error during registration",
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
