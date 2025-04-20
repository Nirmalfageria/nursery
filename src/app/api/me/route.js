import { NextResponse } from 'next/server';
import dbconnect from "../../../db/index";
import User from "../../../models/user.model";

export async function GET(request) {
  try {
    await dbconnect();
    
    // Alternative session check (example using session ID)
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { message: 'Not authenticated', success: false },
        { status: 401 }
      );
    }

    // Find user by session ID (you'll need a sessions collection)
    const user = await User.findOne({ 
      _id: sessionId 
    }).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user, success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication failed', success: false },
      { status: 401 }
    );
  }
}