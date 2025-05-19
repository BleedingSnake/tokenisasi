
// src/app/dashboard/page.tsx

'use client';

import AuthCheck from '../../components/AuthCheck';
import WasteTable from '../../components/WasteTable';

export default function DashboardPage() {
  return (
    <AuthCheck>
      <main className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Waste Collection Dashboard</h1>
            <p className="text-gray-600">
              View and analyze waste retrieval data
            </p>
          </div>
          
          <WasteTable />
        </div>
      </main>
    </AuthCheck>
  );
}