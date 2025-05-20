// pages/api/pots.js
import connectDB from "../../../db/index";
import Pot from "../../../models/pots.model";
import { NextResponse } from 'next/server';


export const config = {
  api: {
    bodyParser: true, // enable JSON parsing
  },
};

export async function POST(request) {
  try {
    await connectDB(); // Connect to MongoDB

    const data = await request.json();

    // Basic validation
    if (
      !data.name ||
      !data.imageUrl ||
      !data.price ||
      !data.material ||
      !data.size ||
      data.stock === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new pot document
    const newPot = new Pot({
      name: data.name,
      imageUrl: data.imageUrl,
      description: data.description || '',
      price: data.price,
      material: data.material,
      size: data.size,
      stock: data.stock,
    });

    await newPot.save();

    return NextResponse.json(
      { message: 'Pot created successfully', pot: newPot },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    await connectDB();
    const pots = await Pot.find().lean();

    return Response.json(pots);
  } catch (error) {
    console.error("Error fetching pots:", error);
    return new Response("Failed to fetch pots", { status: 500 });
  }
}
