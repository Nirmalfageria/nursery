import dbConnect from '../../../db/index';
import User from '../../../models/user.model';

export async function POST(req) {
  try {
    await dbConnect();

    const { contact, otp, type } = await req.json();

    if (!contact || !otp || !type) {
      return new Response(JSON.stringify({ success: false, message: 'Missing fields' }), { status: 400 });
    }

    const query = type === 'email' ? { email: contact } : { phoneNumber: contact };
    const user = await User.findOne(query);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    if (
      !user.verificationCode ||
      !user.verificationExpiry ||
      user.verificationCode !== otp ||
      user.verificationExpiry < new Date()
    ) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or expired OTP' }), { status: 400 });
    }

    // OTP is valid — clear the verification fields
    user.verificationCode = null;
    user.verificationExpiry = null;
    user.isVerified = true;
    await user.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
}
