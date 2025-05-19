export interface WasteRetrieval {
  id: string;
  type: 'organic' | 'non-organic' | 'plastic';
  location: string;
  timestamp: Date;
  userId: string;
  userEmail?: string;
}

export interface QRCodeData {
  type: 'organic' | 'non-organic' | 'plastic';
  location: string;
}