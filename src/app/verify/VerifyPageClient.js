'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function VerifyPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const phoneNumber = searchParams.get('phoneNumber');

  const [contact, setContact] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const confirmationResultRef = useRef(null);

  useEffect(() => {
    if (email) {
      setContact(email);
      setIsEmail(true);
    } else if (phoneNumber) {
      setContact(phoneNumber);
      setIsEmail(false);
    } else {
      setMessage('❌ No email or phone number provided.');
    }
  }, [email, phoneNumber]);

  useEffect(() => {
    if (isEmail && contact) {
      sendOtp(); // auto-send for email
    }
  }, [isEmail, contact]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setMessage('Recaptcha expired. Please try again.');
        },
      });
    }
  };

  async function sendOtp() {
    setLoading(true);
    setMessage('');

    if (isEmail) {
      try {
        const res = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, type: 'email' }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOtpSent(true);
          setMessage('✅ OTP sent to email!');
          setResendTimer(60);
        } else {
          setMessage(`❌ Failed to send OTP: ${data.message}`);
        }
      } catch {
        setMessage('❌ Error sending OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formattedPhone = contact.startsWith('+') ? contact : `+91${contact}`;
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        confirmationResultRef.current = confirmationResult;
        setOtpSent(true);
        setMessage('✅ OTP sent to phone!');
        setResendTimer(60);
      } catch (error) {
        console.error(error);
        setMessage('❌ Failed to send OTP via phone.');
      } finally {
        setLoading(false);
      }
    }
  }

  async function verifyOtp() {
    if (!otp) return setMessage('❌ Please enter the OTP.');
    setLoading(true);
    setMessage('');

    if (isEmail) {
      try {
        const res = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, otp, type: 'email' }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessage('✅ Email verified! Redirecting...');
          setTimeout(() => router.push('/account'), 2000);
        } else {
          setMessage(`❌ Verification failed: ${data.message}`);
        }
      } catch {
        setMessage('❌ Error verifying email OTP.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const result = await confirmationResultRef.current.confirm(otp);
        if (result?.user) {
          setMessage('✅ Phone verified! Redirecting...');
          setTimeout(() => router.push('/account'), 2000);
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ Invalid OTP for phone.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-green-700">
          {otpSent ? 'Enter OTP' : 'Verify your account'}
        </h1>

        <p className="mb-4">
          {isEmail
            ? `We will send an OTP to your email: ${contact}`
            : `We will send an OTP to your phone number: ${contact}`}
        </p>

        {!otpSent && !isEmail && (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50 mb-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={sendOtp}
              disabled={resendTimer > 0 || loading}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : 'Resend OTP'}
            </button>
          </>
        )}

        <div id="recaptcha-container" />

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
