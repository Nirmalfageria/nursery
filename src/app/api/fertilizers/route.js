import connectDB from "../../../db/index";
import Fertilizer from "../../../models/fertilizer.model";
import { NextResponse } from 'next/server';

// ✅ POST: Create a new fertilizer
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const {
      name,
      imageUrl,
      description = "",
      pricePerUnit,
      priceUnit = "per kg",
      category,
      inStock,
    } = data;

    if (!name || !imageUrl || !pricePerUnit || !category || inStock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newFertilizer = new Fertilizer({
      name,
      imageUrl,
      description,
      pricePerUnit,
      priceUnit,
      category,
      inStock,
    });

    await newFertilizer.save();

    return NextResponse.json(
      { message: "Fertilizer created successfully", fertilizer: newFertilizer },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/fertilizers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ GET: Fetch all fertilizers
export async function GET() {
  try {
    await connectDB();
    const fertilizers = await Fertilizer.find().lean();
    return NextResponse.json(fertilizers);
  } catch (error) {
    console.error("GET /api/fertilizers error:", error);
    return NextResponse.json({ error: "Failed to fetch fertilizers" }, { status: 500 });
  }
}
