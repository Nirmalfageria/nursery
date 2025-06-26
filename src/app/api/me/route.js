import { NextResponse } from 'next/server';
import dbconnect from '../../../db/index';
import User from '../../../models/user.model';

export async function GET(request) {
  try {
    await dbconnect();

    const sessionCookie = request.cookies.get('session');
    const sessionId = sessionCookie?.value;

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
      {
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication failed', success: false },
      { status: 500 }
    );
  }
}
