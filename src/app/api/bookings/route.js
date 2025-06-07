import dbConnect from "../../../db/index";
import Booking from "../../../models/booking.model";
import User from "../../../models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key.trim(), decodeURIComponent(v.join("="))];
      })
    );

    const session = cookies.session;
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid session", success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId, address, date } = body;
    //  console.log(serviceId, address, date);
    if (!date || !address || !serviceId) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Validate and convert date
    const today = new Date();
    const bookingDate = new Date(date);
    if (bookingDate <= today) {
      return NextResponse.json(
        { message: "Booking date must be later than today", success: false },
        { status: 400 }
      );
    }
    console.log(user._id);
    console.log(serviceId);
    // console.log({ userId, serviceId, date, address });

    const booking = new Booking({
      userId: user._id,
      serviceId: new mongoose.Types.ObjectId(serviceId),
      date: new Date(date),
      address,
      createdAt: new Date(),
    });

    await booking.save();

    return NextResponse.json(
      { message: "Booking successful", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { message: "Booking failed", success: false },
      { status: 500 }
    );
  }
}
