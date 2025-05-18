// pages/api/pots.js
import connectDB from "../../../db/index";
import Pot from "../../../models/pots.model";


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
