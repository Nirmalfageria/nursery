import { NextResponse } from 'next/server';
import dbconnect from '@/db/index';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { cookies as getCookies } from 'next/headers'; // not used here but good for middleware

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, decodeURIComponent(v.join('='))];
    }));

    const session = cookies.session;

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    await dbconnect();

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: 'Invalid session', success: false }, { status: 401 });
    }

    const { cartItems, address } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty', success: false }, { status: 400 });
    }

    if (!address) {
      return NextResponse.json({ message: 'Address is required', success: false }, { status: 400 });
    }

    const newOrder = await Order.create({
      items: cartItems,
      user: user._id,
      address
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
