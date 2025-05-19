// src/app/login/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import LoginButton from '../../components/LoginButton';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Waste Management System</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
        </div>
        
        <div className="flex justify-center">
          <LoginButton />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You need to sign in to track waste collection and view data</p>
        </div>
      </div>
    </div>
  );
}