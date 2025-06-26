import { NextResponse } from 'next/server';
import dbconnect from '@/db/index';
import Order from '@/models/order.model';
import User from '@/models/user.model';

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

    const { cartItems, address, paymentMethod, totalAmount } = await request.json();

    // Validate cart
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty', success: false }, { status: 400 });
    }

    // Validate address
    if (
      !address || !address.street || !address.city ||
      !address.state || !address.pincode
    ) {
      return NextResponse.json({ message: 'Incomplete address', success: false }, { status: 400 });
    }

    // Validate payment method
    if (!['COD', 'UPI'].includes(paymentMethod)) {
      return NextResponse.json({ message: 'Invalid payment method', success: false }, { status: 400 });
    }

    // Validate amount
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ message: 'Invalid total amount', success: false }, { status: 400 });
    }

    // Construct order items properly
    const items = cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.imageUrl,
      plantId: item._id,
    }));

    const paymentStatus = paymentMethod === 'UPI' ? 'Paid' : 'Pending';

    const newOrder = await Order.create({
      items,
      user: user._id,
      address,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status: 'Pending',
    });

    return NextResponse.json({
      message: 'Order placed successfully',
      success: true,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error('Order placement error:', error);
    return NextResponse.json({
      message: 'Order failed',
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
