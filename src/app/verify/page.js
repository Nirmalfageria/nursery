// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';

// export default function VerifyPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // Get email or phoneNumber from query params
//   const email = searchParams.get('email');
//   const phoneNumber = searchParams.get('phoneNumber');

//   const [contact, setContact] = useState('');
//   const [isEmail, setIsEmail] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [resendTimer, setResendTimer] = useState(0);

//   useEffect(() => {
//     if (email) {
//       setContact(email);
//       setIsEmail(true);
//     } else if (phoneNumber) {
//       setContact(phoneNumber);
//       setIsEmail(false);
//     } else {
//       setMessage('❌ No email or phone number provided to verify.');
//     }
//   }, [email, phoneNumber]);

//   useEffect(() => {
//     let interval = null;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (resendTimer === 0) {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [resendTimer]);

//   async function sendOtp() {
//     if (!contact) return;
//     setLoading(true);
//     setMessage('');
//     try {
//       const res = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contact,
//           type: isEmail ? 'email' : 'phone',
//         }),
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setOtpSent(true);
//         setMessage('✅ OTP sent successfully!');
//         setResendTimer(60); // 60 seconds before resend allowed
//       } else {
//         setMessage(`❌ Failed to send OTP: ${data.message || 'Unknown error'}`);
//       }
//     } catch (err) {
//       setMessage('❌ Error sending OTP, please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function verifyOtp() {
//     if (!otp) {
//       setMessage('❌ Please enter the OTP.');
//       return;
//     }
//     setLoading(true);
//     setMessage('');
//     try {
//       const res = await fetch('/api/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contact,
//           otp,
//           type: isEmail ? 'email' : 'phone',
//         }),
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setMessage('✅ Verification successful! Redirecting...');
//         setTimeout(() => {
//           router.push('/dashboard');
//         }, 2000);
//       } else {
//         setMessage(`❌ Verification failed: ${data.message || 'Invalid OTP'}`);
//       }
//     } catch (err) {
//       setMessage('❌ Error verifying OTP, please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//         <h1 className="text-2xl font-semibold mb-6 text-green-700">
//           {otpSent ? 'Enter OTP' : 'Verify your account'}
//         </h1>

//         <p className="mb-4">
//           {isEmail
//             ? `We will send an OTP to your email: ${contact}`
//             : `We will send an OTP to your phone number: ${contact}`}
//         </p>

//         {!otpSent ? (
//           <button
//             onClick={sendOtp}
//             disabled={loading}
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
//           >
//             {loading ? 'Sending OTP...' : 'Send OTP'}
//           </button>
//         ) : (
//           <>
//             <input
//               type="text"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.trim())}
//               placeholder="Enter OTP"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50 mb-2"
//             >
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>

//             <button
//               onClick={sendOtp}
//               disabled={resendTimer > 0 || loading}
//               className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
//             >
//               {resendTimer > 0
//                 ? `Resend OTP in ${resendTimer}s`
//                 : 'Resend OTP'}
//             </button>
//           </>
//         )}

//         {message && (
//           <p
//             className={`mt-4 text-center ${
//               message.startsWith('✅')
//                 ? 'text-green-600'
//                 : 'text-red-600'
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
