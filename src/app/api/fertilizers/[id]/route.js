import connectDB from "../../../../db/index";
import Fertilizer from "../../../../models/fertilizers.model";

// ✅ GET: Get a specific fertilizer by ID
export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const fertilizer = await Fertilizer.findById(id);

    if (!fertilizer) {
      return new Response(JSON.stringify({ error: "Fertilizer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(fertilizer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/fertilizers/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch fertilizer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ PUT: Update a fertilizer by ID
export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const body = await request.json();

    const updatedFertilizer = await Fertilizer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFertilizer) {
      return new Response(JSON.stringify({ error: "Fertilizer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedFertilizer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/fertilizers/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to update fertilizer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ DELETE: Delete a fertilizer by ID
export async function DELETE(request, { params }) {
  await connectDB();

  try {
    const deletedFertilizer = await Fertilizer.findByIdAndDelete(params.id);
    if (!deletedFertilizer) {
      return Response.json({ error: "Fertilizer not found" }, { status: 404 });
    }

    return Response.json({ message: "Fertilizer deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/fertilizers/[id] error:", error);
    return Response.json({ error: "Failed to delete fertilizer" }, { status: 500 });
  }
}
