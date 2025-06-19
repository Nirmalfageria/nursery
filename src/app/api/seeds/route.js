import connectDB from "../../../db/index";
import Seed from "../../../models/seeds.model";
import { NextResponse } from 'next/server';

// ✅ POST: Create a new seed
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const { name, imageUrl, description = "", pricePerUnit, category, inStock, type } = data;

    if (!name || !imageUrl || !pricePerUnit || !category || inStock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSeed = new Seed({
      name,
      imageUrl,
      description,
      pricePerUnit,
      category,
      inStock,
      type: type || "Organic", // default if not passed
    });

    await newSeed.save();

    return NextResponse.json(
      { message: "Seed created successfully", seed: newSeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/seeds error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ GET: Fetch all seeds
export async function GET() {
  try {
    await connectDB();
    const seeds = await Seed.find().lean();
    return NextResponse.json(seeds);
  } catch (error) {
    console.error("GET /api/seeds error:", error);
    return NextResponse.json({ error: "Failed to fetch seeds" }, { status: 500 });
  }
}
