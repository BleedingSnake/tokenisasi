declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrReaderProps {
    delay?: number | false;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    className?: string;
    facingMode?: 'user' | 'environment';
    legacyMode?: boolean;
    showViewFinder?: boolean;
    constraints?: MediaTrackConstraints;
  }

  export default class QrReader extends Component<QrReaderProps> {}
}