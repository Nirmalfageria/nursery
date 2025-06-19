import connectDB from "../../../../db/index";
import Seed from "../../../../models/seeds.model";

// ✅ GET: Get a specific seed by ID
export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const seed = await Seed.findById(id);

    if (!seed) {
      return new Response(JSON.stringify({ error: "Seed not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(seed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/seeds/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch seed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ PUT: Update a seed by ID
export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const body = await request.json();

    const updatedSeed = await Seed.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeed) {
      return new Response(JSON.stringify({ error: "Seed not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedSeed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/seeds/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to update seed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ DELETE: Delete a seed by ID
export async function DELETE(request, { params }) {
  await connectDB();

  try {
    const deletedSeed = await Seed.findByIdAndDelete(params.id);
    if (!deletedSeed) {
      return Response.json({ error: "Seed not found" }, { status: 404 });
    }

    return Response.json({ message: "Seed deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/seeds/[id] error:", error);
    return Response.json({ error: "Failed to delete seed" }, { status: 500 });
  }
}
