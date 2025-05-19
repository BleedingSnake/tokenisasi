
// src/components/Navbar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from './LoginButton';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Waste Management
          </Link>
          
          <div className="hidden sm:flex space-x-4">
            <Link 
              href="/" 
              className={`px-2 py-1 rounded ${pathname === '/' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-2 py-1 rounded ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Dashboard
            </Link>
          </div>
        </div>
        
        <LoginButton />
      </div>
    </nav>
  );
}