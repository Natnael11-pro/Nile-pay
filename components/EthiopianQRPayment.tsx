'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatEthiopianBirr } from '@/lib/utils';
import { QrCode, Scan, Copy, Check, Loader2, Camera, X } from 'lucide-react';
import { processQRPayment } from '@/lib/actions/transaction.actions';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import { useRouter } from 'next/navigation';

interface QRPaymentProps {
  user: any;
  accounts: any[];
  onSuccess?: () => void;
}

const QRPayment = ({ user, accounts, onSuccess }: QRPaymentProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [amount, setAmount] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [description, setDescription] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedQRData, setScannedQRData] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentAccount, setPaymentAccount] = useState(accounts[0]?.id || '');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state);
        return permission.state === 'granted';
      }
      return true; // Assume granted if permissions API not available
    } catch (error) {
      console.log('Permission check failed:', error);
      return true; // Assume granted if check fails
    }
  };

  const generateQRCode = async () => {
    if (!amount || !selectedAccount) {
      alert('Please enter amount and select account');
      return;
    }

    try {
      const qrData = {
        type: 'nile_pay_payment',
        recipient: user.firstName + ' ' + user.lastName,
        recipientId: user.id,
        account: selectedAccount,
        amount: amount,
        description: description,
        timestamp: Date.now()
      };

      // Generate real QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#FFFFFF'
        }
      });

      setQrCodeDataURL(qrCodeDataURL);
      setQrGenerated(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const copyQRData = () => {
    const qrData = {
      type: 'nile_pay_payment',
      recipient: user.firstName + ' ' + user.lastName,
      account: selectedAccount,
      amount: amount,
      description: description,
      timestamp: Date.now()
    };

    navigator.clipboard.writeText(JSON.stringify(qrData));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      setIsCameraActive(true);

      // Check camera permissions first
      const hasPermission = await checkCameraPermission();
      if (!hasPermission && cameraPermission === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      if (videoRef.current) {
        // Stop any existing scanner first
        if (qrScannerRef.current) {
          qrScannerRef.current.stop();
          qrScannerRef.current.destroy();
        }

        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            try {
              console.log('QR Code detected:', result.data);

              // Try to parse as JSON first
              let qrData;
              try {
                qrData = JSON.parse(result.data);
              } catch (parseError) {
                // If not JSON, treat as plain text (could be a URL or other format)
                console.log('Non-JSON QR code detected:', result.data);
                alert(`QR Code detected: ${result.data}`);
                return;
              }

              if (qrData.type === 'nile_pay_payment') {
                // Check if this is a user-to-user transfer (has recipientId)
                if (qrData.recipientId && qrData.recipientId !== 'demo_merchant_id') {
                  // Navigate to user transfer with pre-filled data
                  stopCamera();
                  const params = new URLSearchParams({
                    recipientId: qrData.recipientId || '',
                    recipient: qrData.recipient || '',
                    amount: qrData.amount?.toString() || '',
                    description: qrData.description || '',
                    account: qrData.account || ''
                  });
                  router.push(`/payment-gateway?tab=user-transfer&${params.toString()}`);
                } else {
                  // Regular merchant payment
                  setScannedQRData(qrData);
                  setPaymentAmount(qrData.amount);
                  stopCamera();
                }
              } else {
                alert('Invalid QR code format. Expected Nile Pay payment QR code.');
              }
            } catch (error) {
              console.error('QR processing error:', error);
              alert('Error processing QR code data');
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera on mobile
            maxScansPerSecond: 5, // Limit scan frequency
          }
        );

        // Set additional scanner options
        qrScannerRef.current.setInversionMode('both');

        await qrScannerRef.current.start();
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Camera error:', error);
      let errorMessage = 'Failed to access camera. ';

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported on this device.';
        } else {
          errorMessage += error.message || 'Please check camera permissions and try again.';
        }
      } else {
        errorMessage += 'Please check camera permissions and try again.';
      }

      setCameraError(errorMessage);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      setIsCameraActive(false);
      setCameraError('');
      console.log('Camera stopped successfully');
    } catch (error) {
      console.error('Error stopping camera:', error);
      setIsCameraActive(false);
    }
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code for demo purposes
    const mockQRData = {
      type: 'nile_pay_payment',
      recipient: 'Coffee Shop',
      recipientId: 'demo_merchant_id',
      account: accounts[0]?.id || '',
      amount: 150,
      description: 'Coffee and pastry',
      timestamp: Date.now()
    };

    setScannedQRData(mockQRData);
    setPaymentAmount(mockQRData.amount);
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const processQRPaymentTransaction = async () => {
    if (!scannedQRData || !paymentAccount) {
      alert('Invalid QR data or account not selected');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processQRPayment({
        senderId: user.$id || user.id,
        senderBankId: paymentAccount,
        recipientId: scannedQRData.recipientId || 'demo_recipient_id',
        recipientBankId: scannedQRData.account,
        amount: paymentAmount,
        description: scannedQRData.description,
        qrData: JSON.stringify(scannedQRData),
      });

      if (result.success) {
        alert('QR Payment successful! 🎉');
        setScannedQRData(null);
        setPaymentAmount(0);
        onSuccess?.();
      } else {
        alert(`QR Payment failed: ${result.error}`);
      }
    } catch (error) {
      alert('QR Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate to user transfer with pre-filled data
  const navigateToUserTransfer = () => {
    if (!scannedQRData) return;

    // Create URL with query parameters for pre-filling the form
    const params = new URLSearchParams({
      recipientId: scannedQRData.recipientId || '',
      recipient: scannedQRData.recipient || '',
      amount: scannedQRData.amount?.toString() || '',
      description: scannedQRData.description || '',
      account: scannedQRData.account || ''
    });

    router.push(`/payment-gateway?tab=user-transfer&${params.toString()}`);
  };



  return (
    <Card className="w-full bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-t-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl flex-shrink-0">📱</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold truncate">QR Payment</CardTitle>
            <CardDescription className="text-orange-100 text-sm sm:text-base">
              Generate QR codes for payments or scan to pay merchants
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Tab Selection */}
        <div className="flex mb-4 sm:mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 border border-orange-200 dark:border-orange-800">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
              activeTab === 'generate'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-orange-600 hover:bg-orange-50'
            }`}
          >
            <QrCode size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Generate QR</span>
            <span className="sm:hidden">Generate</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
              activeTab === 'scan'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-orange-600 hover:bg-orange-50'
            }`}
          >
            <Scan size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Scan QR</span>
            <span className="sm:hidden">Scan</span>
          </button>
        </div>

        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Account Selection */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-100 dark:border-orange-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>🏦</span>
                Select Account for Payment
              </h3>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.bank_name}</span>
                        <span className="font-semibold text-orange-600">
                          {formatEthiopianBirr(account.balance)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 mb-2">
                  <span>💰</span>
                  Amount (ETB)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 mb-2">
                  <span>📝</span>
                  Description (Optional)
                </label>
                <Input
                  placeholder="Payment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Generate Button */}
            {!qrGenerated ? (
              <Button
                onClick={generateQRCode}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                <QrCode className="mr-2 h-5 w-5" />
                Generate QR Code
              </Button>
            ) : (
              <div className="bg-white rounded-lg border border-orange-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment QR Code</h3>

                {/* Real QR Code */}
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4 inline-block">
                  {qrCodeDataURL && (
                    <img
                      src={qrCodeDataURL}
                      alt="Payment QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  )}
                </div>

                {/* Payment Details */}
                <div className="bg-orange-50 rounded-lg p-4 mb-4 text-left">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Recipient:</span>
                      <div className="font-semibold">{user.firstName} {user.lastName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <div className="font-semibold text-orange-600">{formatEthiopianBirr(amount)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Account:</span>
                      <div className="font-semibold">{selectedAccountData?.bank_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <div className="font-semibold">{description || 'No description'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={copyQRData}
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy QR Data'}
                  </Button>
                  <Button
                    onClick={() => setQrGenerated(false)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Generate New
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="space-y-6">
            {!scannedQRData ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Scan QR Code</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Scan QR codes from merchants and make instant payments.
                </p>

                {/* Camera View */}
                {!isCameraActive ? (
                  <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6 max-w-sm mx-auto">
                    <Camera size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Camera ready to scan</p>

                    {cameraError && (
                      <p className="text-red-500 text-sm mb-4">{cameraError}</p>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={startCamera}
                        disabled={isCameraActive}
                        className="bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-400"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {isCameraActive ? 'Camera Active' : 'Start Camera'}
                      </Button>

                      <Button
                        onClick={simulateQRScan}
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Scan className="mr-2 h-4 w-4" />
                        Demo Scan
                      </Button>

                      {/* Test QR Generation */}
                      <Button
                        onClick={() => {
                          const testQR = {
                            type: 'nile_pay_payment',
                            recipient: 'Test User',
                            recipientId: 'test_user_123',
                            account: accounts[0]?.id || '',
                            amount: 100,
                            description: 'Test payment',
                            timestamp: Date.now()
                          };
                          console.log('Test QR Data:', JSON.stringify(testQR));
                          navigator.clipboard.writeText(JSON.stringify(testQR));
                          alert('Test QR data copied to clipboard! You can use this to test scanning.');
                        }}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate Test QR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-black rounded-lg overflow-hidden mb-6 max-w-sm mx-auto">
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      playsInline
                      muted
                      autoPlay
                    />
                    {/* Enhanced scanning overlay */}
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-orange-400 rounded-lg">
                        <div className="absolute inset-0 bg-orange-400/10 rounded-lg"></div>
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br-lg"></div>
                      </div>
                    </div>

                    {/* Control buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        onClick={stopCamera}
                        className="bg-red-600 hover:bg-red-700 text-white p-2"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Instructions */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Position QR code within the frame
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-green-800 mb-2">🇪🇹 QR Payment Network</h4>
                  <p className="text-sm text-green-600">
                    QR payments are fully operational! Use your camera to scan merchant QR codes or try the demo scan feature.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Scanned QR Data */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-orange-600" />
                    Payment Request Scanned
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Merchant:</span>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{scannedQRData.recipient}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Amount:</span>
                      <div className="font-semibold text-orange-600">{formatEthiopianBirr(scannedQRData.amount)}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Description:</span>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{scannedQRData.description}</div>
                    </div>
                  </div>

                  {/* Payment Account Selection */}
                  <div className="mb-6">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 mb-2">
                      <span>🏦</span>
                      Pay from Account
                    </label>
                    <Select value={paymentAccount} onValueChange={setPaymentAccount}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{account.bank_name}</span>
                              <span className="font-semibold text-orange-600">
                                {formatEthiopianBirr(account.balance)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Adjustment */}
                  <div className="mb-6">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 mb-2">
                      <span>💰</span>
                      Payment Amount (ETB)
                    </label>
                    <Input
                      type="number"
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setScannedQRData(null)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>

                    {/* Check if this is a user-to-user transfer */}
                    {scannedQRData?.recipientId && scannedQRData.recipientId !== 'demo_merchant_id' ? (
                      <Button
                        onClick={navigateToUserTransfer}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Send to User
                      </Button>
                    ) : (
                      <Button
                        onClick={processQRPaymentTransaction}
                        disabled={isProcessing || !paymentAccount || paymentAmount <= 0}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <QrCode className="mr-2 h-4 w-4" />
                            Pay {formatEthiopianBirr(paymentAmount)}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QR Payment Info */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-green-600">🇪🇹</span>
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-semibold mb-1">QR Payment Network - Fully Operational</p>
              <p>
                QR payments are secure, instant, and fully functional. Generate QR codes to receive payments
                or scan merchant codes to pay instantly from your bank account.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPayment;
