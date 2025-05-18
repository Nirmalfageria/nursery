'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    usePhone: false, // Toggle between phone and email
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSignupMethod = () => {
    setFormData(prev => ({ ...prev, usePhone: !prev.usePhone }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = '3-20 characters (letters, numbers, _)';
    }

    if (formData.usePhone) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Invalid phone number';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username.toLowerCase(),
          password: formData.password,
          usePhone: formData.usePhone,
          email: formData.usePhone ? '' : formData.email.toLowerCase(),
          phoneNumber: formData.usePhone ? formData.phoneNumber : '',
        })
        
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const errorData = await res.json();
        setErrors(prev => ({ ...prev, form: errorData.message || 'Signup failed' }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        form: error.message.includes('NetworkError')
          ? 'Cannot connect to server'
          : 'An error occurred'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSuccess ? 'Account Created!' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700">
          {isSuccess ? (
            'Redirecting to dashboard...'
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      {!isSuccess && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            {errors.form && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
                {errors.form}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm`}
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">@</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-7 block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm`}
                  />
                </div>
                {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
              </div>

              {/* Email or Phone Number */}
              <div>
                <label htmlFor={formData.usePhone ? 'phoneNumber' : 'email'} className="block text-sm font-medium text-gray-900">
                  {formData.usePhone ? 'Phone Number(enter only 10 digits)' : 'Email Address'}
                </label>
                <input
                  id={formData.usePhone ? 'phoneNumber' : 'email'}
                  name={formData.usePhone ? 'phoneNumber' : 'email'}
                  type={formData.usePhone ? 'tel' : 'email'}
                  autoComplete={formData.usePhone ? 'tel' : 'email'}
                  value={formData.usePhone ? formData.phoneNumber : formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${formData.usePhone ? errors.phoneNumber : errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm`}
                />
                {formData.usePhone ? errors.phoneNumber && <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p> : errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Toggle between email and phone */}
              <div className="mt-4 flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleSignupMethod}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {formData.usePhone ? 'Sign up with Email instead' : 'Sign up with Phone instead'}
                </button>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-indigo-600 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">Confirm Password</label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm sm:text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-indigo-600 hover:underline"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
