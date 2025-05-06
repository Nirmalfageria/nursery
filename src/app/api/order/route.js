import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbconnect from '@/db/index';
import Order from '@/models/order.model';
import User from '@/models/user.model';

export async function POST(request) {
  try {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    await dbconnect();

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: 'Invalid session', success: false }, { status: 401 });
    }

    const { cartItems } = await request.json();

    const newOrder = await Order.create({
      items: cartItems,
      user: user._id,
    });

    await newOrder.save();

    return NextResponse.json({
      message: 'Order placed successfully',
      success: true,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error('Order placement error:', error);
    return NextResponse.json({ message: 'Order failed', success: false, error: error.message }, { status: 500 });
  }
}
