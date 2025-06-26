// import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import dbconnect from "../../../db/index";
import Order from "@/models/order.model";
import User from "@/models/user.model";

export async function GET(request) {
  try {
    // Extract session ID from cookies
    const session = request.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbconnect();

    // Find the user by the session ID
    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Fetch orders for the authenticated user and populate user details
    const orders = await Order.find({ user: user._id })
      .populate("user", "fullName username email") // Adjust fields based on User model
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found", orders: [], success: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ orders, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "No order Found", success: true, error: error.message },
      { status: 500 }
    );
  }
}
