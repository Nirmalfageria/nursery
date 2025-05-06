// src/pages/api/order.js
import dbconnect from "../../../db/index";
import { NextResponse } from "next/server";
import Order from "../../../models/order.model"; // Make sure to create an Order model
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    // Get cart items from request body
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "No items in the cart", success: false },
        { status: 400 }
      );
    }

    await dbconnect(); // Connect to the database

    // Create a new order
    const order = new Order({
      items: cartItems,
      status: "Pending", // The status can be dynamic based on your workflow
      createdAt: new Date(),
    });

    // Save the order to the database
    const savedOrder = await order.save();

    return NextResponse.json(
      { 
        message: "Order placed successfully", 
        success: true,
        orderId: savedOrder._id // You can return the order ID
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Order placement error:", error);
    return NextResponse.json(
      { 
        message: "Error placing the order", 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}
