
import { NextResponse } from 'next/server';
import dbconnect from '../../../../db/index';
import Booking from '../../../../models/booking.model';
import User from '../../../../models/user.model';

export async function GET(request) {
  try {
    // Extract session from cookies
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    // Connect to DB
    await dbconnect();

    // Get user from session
    const user = await User.findById(session);

    if (!user) {
      return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only', success: false }, { status: 403 });
    }

    // Fetch all bookings with user details
   const bookings = await Booking.find()
  .populate('userId', 'fullName username')
  .sort({ createdAt: -1 });

if (!bookings || bookings.length === 0) {
  return NextResponse.json({ bookings: [], message: 'No bookings found', success: true }, { status: 200 });
}

return NextResponse.json({ bookings, success: true }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin bookings', success: false, error: error.message },
      { status: 500 }
    );
  }
}
