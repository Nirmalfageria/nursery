import { NextResponse } from 'next/server';
import dbconnect from "../../../db/index";
import User from "../../../models/user.model";

export async function GET(request) {
  try {
    await dbconnect();

    const cookie = request.cookies.get('session');
    const sessionId = cookie?.value;

    console.log("Session cookie:", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Not authenticated', success: false },
        { status: 401 }
      );
    }

    const user = await User.findById(sessionId).select('-password');

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
