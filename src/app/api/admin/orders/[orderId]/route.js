import { NextResponse } from 'next/server';
import dbconnect from '../../../../../db/index';
import Order from '../../../../../models/order.model';
import User from '../../../../../models/user.model';

export async function PATCH(request, { params }) {
  try {
    const { orderId } = params;
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
    }

    await dbconnect();

    const user = await User.findById(session);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only', success: false }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ message: 'Invalid status', success: false }, { status: 400 });
    }

    // Capitalize status if needed (optional, for consistent DB values)
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: formattedStatus },
      { new: true }
    ).populate('user', 'fullName username');

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order updated', order: updatedOrder, success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      message: 'Server error',
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
