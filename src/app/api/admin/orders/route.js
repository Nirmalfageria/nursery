// src/app/api/admin/orders/[orderId]/route.js

import { NextResponse } from 'next/server';
import dbconnect from '@/db/index';
import Order from '@/models/order.model';
import User from '@/models/user.model';

export async function PATCH(request, { params }) {
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

    const { orderId } = params; // ✅ Get from route param
    const body = await request.json();
    const { newStatus } = body;

    if (!newStatus) {
      return NextResponse.json({ message: 'Missing newStatus', success: false }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    ).populate('user', 'fullName username email phoneNumber');

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated', order: updatedOrder, success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { message: 'Failed to update order status', success: false, error: error.message },
      { status: 500 }
    );
  }
}
