import dbConnect from '../../../db/index';
import User from '../../../models/user.model';        // your User mongoose model
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function POST(req) {
  try {
    await dbConnect();

    const { contact, type } = await req.json();

    if (!contact || !type) {
      return new Response(
        JSON.stringify({ success: false, message: 'Contact and type required' }),
        { status: 400 }
      );
    }

    const query = type === 'email' ? { email: contact } : { phoneNumber: contact };
    const user = await User.findOne(query);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code
    const verificationCode = randomInt(100000, 999999).toString();
    const verificationExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    user.verificationCode = verificationCode;
    user.verificationExpiry = verificationExpiry;
    await user.save();

    if (type === 'email') {
      await transporter.sendMail({
        from: `"Your App" <${process.env.GMAIL_USER}>`,
        to: contact,
        subject: 'Your OTP Code',
        text: `Your OTP is ${verificationCode}. It will expire in 5 minutes.`,
        html: `<p>Your OTP is <b>${verificationCode}</b>. It will expire in 5 minutes.</p>`,
      });
    } else {
      // TODO: Implement SMS OTP sending for phoneNumber
      console.log(`Send SMS OTP ${verificationCode} to phone ${contact}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Send OTP error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error sending OTP' }),
      { status: 500 }
    );
  }
}
