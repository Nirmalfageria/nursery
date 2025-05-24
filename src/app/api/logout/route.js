import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful', success: true },
      { status: 200 }
    );

    // Clear the session cookie
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    // ✅ Clear the isAdmin cookie too
    response.cookies.set('isAdmin', '', {
      httpOnly: false, // You likely set this from the client, so it shouldn't be httpOnly
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
    
  

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed', success: false },
      { status: 500 }
    );
  }
}
