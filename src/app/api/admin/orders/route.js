import { NextResponse } from 'next/server';
import dbconnect from '@/db/index';
import Order from '@/models/order.model';
import User from '@/models/user.model';

export async function GET(request) {
  try {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    await dbconnect();

    const user = await User.findById(session);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only', success: false }, { status: 403 });
    }

    // Fetch orders with user details (name, email, phone)
    const orders = await Order.find()
      .populate('user', 'fullName username email phoneNumber')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders found', orders: [], success: true }, { status: 200 });
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
