import dbconnect from "../../../../db/index";
import Plant from "../../../../models/plants.model";
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbconnect();
  const { id } = params;

  try {
    const plant = await Plant.findById(id);
    if (!plant) return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plant' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbconnect();
  const { id } =await params;

  try {
    const updatedData = await req.json();
    const updatedPlant = await Plant.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlant);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plant' }, { status: 500 });
  }
}
export async function DELETE(req,{params}) {
  await dbconnect();

  try {
    // const body = await req.json();/
    const { id } = await params;

    const deletedPlant = await Plant.findByIdAndDelete(id);
    console.log(deletedPlant)
    if (!deletedPlant) {
      return NextResponse.json({ message: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plant deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
