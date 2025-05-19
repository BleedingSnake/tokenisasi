'use client';

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function LoginButton() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm mr-2">{user.email}</span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm"
        >
          {loading ? 'Loading...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm"
    >
      {loading ? 'Loading...' : 'Sign in with Google'}
    </button>
  );
}