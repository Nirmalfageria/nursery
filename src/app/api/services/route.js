import dbConnect from "../../../db/index";
import Service from "../../../models/service.model";

await dbConnect();
export async function GET(request) {
  try {
    const services = await Service.find();
    return Response.json(services);
  } catch (error) {
    return new Response("Failed to fetch services", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, price, description } = await request.json();

    const existingService = await Service.findOne({ name });

    if (existingService) {
      // Update existing service
      existingService.price = price;
      existingService.description = description;
      await existingService.save();
      return Response.json({ message: "Service updated", service: existingService });
    } else {
      // Create new service
      const newService = await Service.create({ name, price, description });
      return Response.json({ message: "Service created", service: newService });
    }
  } catch (error) {
    console.error("Error in POST /api/services:", error);
    return new Response("Failed to create or update service", { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return new Response("Service not found", { status: 404 });
    }
    return Response.json({ message: "Service deleted", service: deleted });
  } catch (error) {
    console.error("Error in DELETE /api/services:", error);
    return new Response("Failed to delete service", { status: 500 });
  }
}