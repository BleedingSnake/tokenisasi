// src/components/WasteTable.tsx

'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WasteRetrieval } from '../types';
import { formatDate } from '../lib/utils';

export default function WasteTable() {
  const [wasteData, setWasteData] = useState<WasteRetrieval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const wasteQuery = query(
          collection(db, 'wasteRetrievals'),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(wasteQuery);
        const wasteItems: WasteRetrieval[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          wasteItems.push({
            id: doc.id,
            type: data.type,
            location: data.location,
            timestamp: (data.timestamp as Timestamp).toDate(),
            userId: data.userId,
            userEmail: data.userEmail
          });
        });
        
        setWasteData(wasteItems);
      } catch (error) {
        console.error('Error fetching waste data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();
  }, []);

  const filteredData = wasteData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic':
        return 'bg-green-100 text-green-800';
      case 'non-organic':
        return 'bg-yellow-100 text-yellow-800';
      case 'plastic':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Waste Retrieval Records</h2>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('organic')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              filter === 'organic' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Organic
          </button>
          <button
            onClick={() => setFilter('non-organic')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              filter === 'non-organic' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Non-Organic
          </button>
          <button
            onClick={() => setFilter('plastic')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              filter === 'plastic' 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Plastic
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredData.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No waste retrieval records found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.userEmail || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}