// src/components/QrScanner.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { parseQRCode, submitWasteRetrieval } from '../lib/utils';
import dynamic from 'next/dynamic';

// We'll load these client-side only

// Instead of dynamically importing with Next.js, we'll handle this during component mounting
// This is because html5-qrcode doesn't export React components, but plain JS classes
let Html5QrcodeScanner: any = null;
let Html5Qrcode: any = null;

export default function QrScanner() {
  const [user] = useAuthState(auth);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const scannerInstanceRef = useRef<any>(null);

  // Load the library on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html5-qrcode').then((module) => {
        Html5QrcodeScanner = module.Html5QrcodeScanner;
        Html5Qrcode = module.Html5Qrcode;
      });
    }
  }, []);

  // Create and destroy scanner on mount/unmount
  useEffect(() => {
    // Clean up the scanner when component unmounts
    return () => {
      if (scannerInstanceRef.current) {
        try {
          // The clear method returns a Promise, so we need to handle it properly
          scannerInstanceRef.current.clear()
            .catch((error: any) => {
              console.error('Error clearing scanner:', error);
            });
        } catch (error) {
          console.error('Error during scanner cleanup:', error);
        }
      }
    };
  }, []);

  // Manage scanner when scanning state changes
  useEffect(() => {
    if (scanning && scannerRef.current && Html5QrcodeScanner) {
      if (!scannerInstanceRef.current) {
        // Create the scanner instance
        const scanner = new Html5QrcodeScanner(
          "qr-reader", 
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
          },
          /* verbose= */ false
        );
        
        scannerInstanceRef.current = scanner;
        
        // Handle successful scan
        scanner.render((decodedText: string) => {
          // Stop scanning when we get a result
          setScanning(false);
          setLoading(true);
          
          handleQrResult(decodedText)
            .finally(() => setLoading(false));
            
        }, (errorMessage: string) => {
          // This is just for QR scanning errors, not for processing errors
          console.error('QR scan error:', errorMessage);
        });
      }
    } else {
      // Clear the scanner if we're not scanning
      if (scannerInstanceRef.current) {
        try {
          scannerInstanceRef.current.clear()
            .then(() => {
              scannerInstanceRef.current = null;
            })
            .catch((error: any) => {
              console.error('Error clearing scanner:', error);
              scannerInstanceRef.current = null;
            });
        } catch (error) {
          console.error('Error during scanner cleanup:', error);
          scannerInstanceRef.current = null;
        }
      }
    }
  }, [scanning, user, Html5QrcodeScanner]);

  // Handle QR code result
  const handleQrResult = async (decodedText: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const qrData = parseQRCode(decodedText);
      
      if (!qrData) {
        throw new Error('Invalid QR code format. Expected "type:location"');
      }
      
      await submitWasteRetrieval(qrData, user.uid, user.email || 'unknown');
      
      setResult({
        success: true,
        message: `Successfully recorded ${qrData.type} waste at ${qrData.location}`
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message
      });
    }
  };

  const toggleScanner = () => {
    setScanning(!scanning);
    if (scanning) {
      setResult(null);
    }
  };

  // Alternative implementation with manual QR data input
  const [manualQrData, setManualQrData] = useState('');
  
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !manualQrData) return;
    
    setLoading(true);
    
    try {
      const qrData = parseQRCode(manualQrData);
      
      if (!qrData) {
        throw new Error('Invalid QR code format. Expected "type:location"');
      }
      
      await submitWasteRetrieval(qrData, user.uid, user.email || 'unknown');
      
      setResult({
        success: true,
        message: `Successfully recorded ${qrData.type} waste at ${qrData.location}`
      });
      
      // Clear the input
      setManualQrData('');
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
      
      {!user ? (
        <p className="text-red-500">Please log in to scan QR codes</p>
      ) : (
        <>
          {/* Camera scanner toggle button */}
          <button
            onClick={toggleScanner}
            className={`w-full py-2 px-4 rounded font-medium ${
              scanning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : scanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
          
          {/* QR Scanner container */}
          <div className="mt-4" ref={scannerRef}>
            {scanning && (
              <>
                <div id="qr-reader" style={{ width: '100%' }}></div>
                <p className="text-sm text-gray-500 mt-2">
                  Point your camera at a QR code containing waste data
                </p>
              </>
            )}
          </div>
          
          {/* Manual input option as a fallback */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-2">Manual QR Data Entry</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualQrData}
                onChange={(e) => setManualQrData(e.target.value)}
                placeholder="e.g. organic:building-a"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium"
                disabled={loading || !manualQrData}
              >
                Submit
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-1">
              Format: type:location (e.g. organic:building-a)
            </p>
          </div>
          
          {/* Result display */}
          {result && (
            <div className={`mt-4 p-3 rounded ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {result.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}