'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username.toLowerCase(), password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors({ form: data.message });
        return;
      }

      router.push('/dashboard');
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-green-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🌱 Welcome Back
        </h2>

        {errors.form && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3">
            <p className="text-sm text-red-700">{errors.form}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-green-900">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.username ? 'border-red-300' : 'border-green-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.password ? 'border-red-300' : 'border-green-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm text-black`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            {/* <label className="flex items-center text-sm text-green-900">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-green-600 border-green-300 rounded"
              />
              Remember me
            </label> */}
            {/* <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link> */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-green-800">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-green-700 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
