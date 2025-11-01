import React, { useEffect, useRef } from 'react';

// Declare Html5Qrcode on the window object to satisfy TypeScript
declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize scanner
      const html5QrCode = new window.Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
        onScanSuccess(decodedText);
        handleClose();
      };
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
        .catch((err: any) => {
          console.error("Unable to start scanning.", err);
          // Optionally, display an error message to the user in the modal
        });
    }

    return () => {
      // Cleanup on component unmount or when modal is closed
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          console.error("Failed to stop scanner.", err);
        });
      }
    };
  }, [isOpen, onScanSuccess]);

  const handleClose = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch((err: any) => {
        console.error("Failed to stop scanner on close.", err);
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4" id="modal-title">
              امسح رمز QR الخاص بك
            </h3>
            <div id="qr-reader" style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px' }}></div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" onClick={handleClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};