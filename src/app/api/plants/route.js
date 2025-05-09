import dbconnect from "../../../db/index";
import Plant from '../../../models/plants.model';

export async function GET() {
  try {
    await dbconnect();
    const plants = await Plant.find();
    return Response.json(plants);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch plants' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbconnect();
    const body = await req.json();
    const newPlant = await Plant.create(body);
    return Response.json(newPlant, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to add plant' }, { status: 500 });
  }
}
