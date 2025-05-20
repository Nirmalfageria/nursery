// // app/api/send-otp/route.js
// import { NextResponse } from 'next/server';
// import admin from 'firebase-admin';

// // Parse credentials from environment
// const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG_JSON || '{}');

// // Initialize Firebase Admin if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export async function POST(request) {
//   const { email, phone } = await request.json();

//   if (!email && !phone) {
//     return NextResponse.json(
//       { success: false, message: 'Email or phone number is required' },
//       { status: 400 }
//     );
//   }

//   try {
//     if (email) {
//       const actionCodeSettings = {
//         url: 'http://localhost:3000/verify', // or your deployed frontend URL
//         handleCodeInApp: true,
//       };

//       const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

//       // Send link using any mailing service here, like Nodemailer
//       console.log(`📧 Email OTP link sent to ${email}:\n${link}`);

//       return NextResponse.json({
//         success: true,
//         type: 'email',
//         message: 'Email verification link sent successfully',
//         link, // (for dev only; don't return this in production)
//       });
//     }

//     if (phone) {
//       return NextResponse.json({
//         success: false,
//         type: 'phone',
//         message:
//           'Phone verification must be done on the client side using Firebase Authentication with reCAPTCHA.',
//       });
//     }
//   } catch (error) {
//     console.error('🔥 Firebase Error:', error);
//     return NextResponse.json(
//       { success: false, message: 'OTP send failed', error: error.message },
//       { status: 500 }
//     );
//   }
// }
