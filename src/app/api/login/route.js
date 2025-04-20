import dbconnect from "../../../db/index";
import { NextResponse } from "next/server";
import User from "../../../models/user.model";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required", success: false },
        { status: 400 }
      );
    }

    await dbconnect();

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password", success: false },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid username or password", success: false },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { 
        message: "Login successful", 
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Set session cookie with user ID
    response.cookies.set('session', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 1 day
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        message: "Error during login", 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}