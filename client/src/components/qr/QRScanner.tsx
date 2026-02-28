'use client';
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (zoneId: string) => void;
  onError?: (err: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Extract zoneId from URL or use raw text
        const match = decodedText.match(/\/scan\/([^/?]+)/);
        const zoneId = match ? match[1] : decodedText;
        onScan(zoneId);
      },
      (err) => onError?.(err)
    ).catch((err: unknown) => onError?.(String(err)));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan, onError]);

  return (
    <div className="w-full">
      <div id="qr-reader" ref={containerRef} className="w-full rounded-xl overflow-hidden" />
      <p className="text-xs text-gray-400 text-center mt-2">Position the QR code within the frame</p>
    </div>
  );
}
