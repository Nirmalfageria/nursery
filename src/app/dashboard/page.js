'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch user data');
        }

        const { user, success } = await response.json();
        if (success) {
          setUserData(user);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.message);
        document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUserData(null);
        window.location.href = '/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-b-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-2 px-5 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">Dashboard</h1>
          <div className="flex items-center gap-4">
            {userData && (
              <span className="text-sm text-gray-700">
                Hello, <span className="font-medium">{userData.fullName || userData.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white shadow rounded-xl p-6">
          {userData ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-800">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3">Profile</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>Full Name:</strong> {userData.fullName}</li>
                    <li><strong>Username:</strong> @{userData.username}</li>
                    <li><strong>Email:</strong> {userData.email}</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3">Actions</h3>
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/profile/edit"
                      className="inline-block text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800">No user data found</h3>
              <p className="text-gray-600 mt-2">Please login to view your dashboard</p>
              <Link
                href="/login"
                className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
