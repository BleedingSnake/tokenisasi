// src/app/api/qr-scan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { parseQRCode, submitWasteRetrieval } from '../../../lib/utils';

/**
 * API endpoint to handle QR code scanning and waste data submission
 * This is an alternative to the client-side implementation
 * Can be used with a simple form or from a mobile app
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrData, userId, userEmail } = body;

    if (!qrData || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parsedData = parseQRCode(qrData);

    if (!parsedData) {
      return NextResponse.json(
        { success: false, error: 'Invalid QR code format' },
        { status: 400 }
      );
    }

    const documentId = await submitWasteRetrieval(
      parsedData,
      userId,
      userEmail || 'unknown'
    );

    return NextResponse.json(
      { 
        success: true, 
        documentId,
        message: `Successfully recorded ${parsedData.type} waste retrieval at ${parsedData.location}`
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing QR scan:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}