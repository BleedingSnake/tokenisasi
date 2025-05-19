// src/app/page.tsx

import Link from 'next/link';
import QrScanner from '../components/QrScanner';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Waste Distribution Management</h1>
          <p className="text-gray-600">
            Scan QR codes to record waste retrieval or view the dashboard
          </p>
        </div>

        <div className="mb-8">
          <QrScanner />
        </div>

        <div className="text-center">
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}