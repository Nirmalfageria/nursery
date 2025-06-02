// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbconnect from '../../../../db/index';
import Order from '../../../../models/order.model';
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

    // Fetch all orders with user details
    const orders = await Order.find()
  .populate('user', 'fullName username') // fetch only these fields from User
  .sort({ createdAt: -1 }); // newest orders first


    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders found', success: true }, { status: 404 });
    }

    return NextResponse.json({ orders, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin orders', success: false, error: error.message },
      { status: 500 }
    );
  }
}
