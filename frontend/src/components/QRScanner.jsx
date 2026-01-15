import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [error, setError] = useState("");

  const stopScanner = async (scanner) => {
    if (scanner && scanner.isScanning) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = scanner;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    scanner
      .start({ facingMode: "environment" }, config, (decodedText) => {
        onScan(decodedText);
        stopScanner(scanner);
      })
      .catch((err) => {
        setError("Failed to start camera. Please check permissions.");
        console.error(err);
      });

    return () => {
      stopScanner(scanner);
    };
  }, []);

  const handleClose = async () => {
    if (html5QrCodeRef.current) {
      await stopScanner(html5QrCodeRef.current);
    }
    onClose();
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="scanner-header">
          <h2>Scan QR Code</h2>
          <button onClick={handleClose} className="close-btn">
            ✕
          </button>
        </div>

        {error ? (
          <div className="scanner-error">{error}</div>
        ) : (
          <div id="qr-reader" ref={scannerRef}></div>
        )}

        <p className="scanner-hint">Position the QR code within the frame</p>
      </div>
    </div>
  );
}

export default QRScanner;
