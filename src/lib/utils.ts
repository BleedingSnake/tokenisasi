import { collection, query, where, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { QRCodeData, WasteRetrieval } from '../types';
import { subDays } from 'date-fns';

// Parse QR code data in format "type:location"
export const parseQRCode = (data: string): QRCodeData | null => {
  try {
    const [type, location] = data.split(':');
    
    if (!type || !location) {
      throw new Error('Invalid QR code format');
    }
    
    if (!['organic', 'non-organic', 'plastic'].includes(type)) {
      throw new Error('Invalid waste type');
    }
    
    return {
      type: type as 'organic' | 'non-organic' | 'plastic',
      location
    };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};

// Check if the location has been submitted in the last 24 hours
export const checkLocationSubmitted = async (location: string): Promise<boolean> => {
  const yesterday = subDays(new Date(), 1);
  
  const wasteCollection = collection(db, 'wasteRetrievals');
  const q = query(
    wasteCollection,
    where('location', '==', location),
    where('timestamp', '>=', Timestamp.fromDate(yesterday))
  );
  
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Submit waste retrieval data
export const submitWasteRetrieval = async (
  qrData: QRCodeData,
  userId: string,
  userEmail: string
): Promise<string> => {
  const wasteCollection = collection(db, 'wasteRetrievals');
  
  const alreadySubmitted = await checkLocationSubmitted(qrData.location);
  if (alreadySubmitted) {
    throw new Error('This location has already been submitted in the last 24 hours');
  }
  
  const docRef = await addDoc(wasteCollection, {
    type: qrData.type,
    location: qrData.location,
    timestamp: Timestamp.now(),
    userId,
    userEmail
  });
  
  return docRef.id;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};