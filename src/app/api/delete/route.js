// app/api/delete/route.js

import dbconnect from "../../../db/index";
import Plant from "../../../models/plants.model";

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(req) {
  await dbconnect();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const deletedPlant = await Plant.findByIdAndDelete(id);
    if (!deletedPlant) {
      return NextResponse.json({ message: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plant deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
