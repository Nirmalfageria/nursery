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
    if (!user) {
      return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    const updateFields = {};

    // Normalize status & paymentStatus
    if (status && typeof status === 'string') {
      updateFields.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    if (paymentStatus && typeof paymentStatus === 'string') {
      updateFields.paymentStatus = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1).toLowerCase();
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update', success: false }, { status: 400 });
    }

    const order = await Order.findById(orderId).populate('user', 'fullName username');

    if (!order) {
      return NextResponse.json({ message: 'Order not found', success: false }, { status: 404 });
    }

    // ✅ Admin can update anything
    if (user.role === 'admin') {
      Object.assign(order, updateFields);
      await order.save();
      return NextResponse.json({ message: 'Order updated', order, success: true }, { status: 200 });
    }

    // ✅ Customer can only cancel their own "Pending" order
    if (user._id.equals(order.user._id)) {
      if (updateFields.status === 'Cancelled' && order.status === 'Pending') {
        order.status = 'Cancelled';
        await order.save();
        return NextResponse.json({ message: 'Order cancelled', order, success: true }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'You can only cancel pending orders', success: false }, { status: 403 });
      }
    }

    return NextResponse.json({ message: 'Forbidden: Not your order', success: false }, { status: 403 });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      message: 'Server error',
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
