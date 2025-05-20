import dbconnect from "../../../../db/index";
import Pot from "../../../../models/pots.model";

export async function GET(request, { params }) {
  await dbconnect();

  const { id } = params;

  try {
    const pot = await Pot.findById(id);

    if (!pot) {
      return new Response(JSON.stringify({ error: "Pot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(pot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/pots/[id] error:", error);

    return new Response(JSON.stringify({ error: "Failed to fetch pot" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function PUT(request, { params }) {
  await dbconnect();

  const { id } = params;

  try {
    const body = await request.json();

    const updatedPot = await Pot.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPot) {
      return new Response(JSON.stringify({ error: "Pot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedPot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/pots/[id] error:", error);

    return new Response(JSON.stringify({ error: "Failed to update pot" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function DELETE(request, { params }) {
  await dbconnect();
  try {
    const deletedPot = await Pot.findByIdAndDelete(params.id);
    if (!deletedPot) {
      return Response.json({ error: 'Pot not found' }, { status: 404 });
    }
    return Response.json({ message: 'Pot deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete pot' }, { status: 500 });
  }
}
