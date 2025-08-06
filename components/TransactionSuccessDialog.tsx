'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, X, Send, CreditCard, Smartphone, QrCode, Users, Copy, Share2 } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';

interface TransactionResult {
  type: 'money_transfer' | 'bill_payment' | 'mobile_money' | 'qr_payment' | 'user_transfer';
  amount: number;
  transactionId: string;
  timestamp: string;
  description?: string;
  
  // Recipient details
  recipientName?: string;
  recipientInfo?: string; // Bank, phone, email, etc.
  
  // Sender details
  senderAccountName?: string;
  senderBankName?: string;
}

interface TransactionSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionResult: TransactionResult;
}

const TransactionSuccessDialog = ({
  isOpen,
  onClose,
  transactionResult
}: TransactionSuccessDialogProps) => {
  const getIcon = () => {
    switch (transactionResult.type) {
      case 'money_transfer':
        return <Send className="h-6 w-6 text-white" />;
      case 'bill_payment':
        return <CreditCard className="h-6 w-6 text-white" />;
      case 'mobile_money':
        return <Smartphone className="h-6 w-6 text-white" />;
      case 'qr_payment':
        return <QrCode className="h-6 w-6 text-white" />;
      case 'user_transfer':
        return <Users className="h-6 w-6 text-white" />;
      default:
        return <Send className="h-6 w-6 text-white" />;
    }
  };

  const getTitle = () => {
    switch (transactionResult.type) {
      case 'money_transfer':
        return 'Money Transfer Successful!';
      case 'bill_payment':
        return 'Bill Payment Successful!';
      case 'mobile_money':
        return 'Mobile Money Transfer Successful!';
      case 'qr_payment':
        return 'QR Payment Successful!';
      case 'user_transfer':
        return 'User Transfer Successful!';
      default:
        return 'Transaction Successful!';
    }
  };

  const getSuccessMessage = () => {
    switch (transactionResult.type) {
      case 'money_transfer':
        return `Your money transfer of ${formatEthiopianBirr(transactionResult.amount)} to ${transactionResult.recipientName} has been processed successfully.`;
      case 'bill_payment':
        return `Your bill payment of ${formatEthiopianBirr(transactionResult.amount)} has been processed successfully.`;
      case 'mobile_money':
        return `Your mobile money transfer of ${formatEthiopianBirr(transactionResult.amount)} to ${transactionResult.recipientName} has been sent successfully.`;
      case 'qr_payment':
        return `Your QR payment of ${formatEthiopianBirr(transactionResult.amount)} has been processed successfully.`;
      case 'user_transfer':
        return `Your transfer of ${formatEthiopianBirr(transactionResult.amount)} to ${transactionResult.recipientName} has been sent successfully.`;
      default:
        return `Your transaction of ${formatEthiopianBirr(transactionResult.amount)} has been processed successfully.`;
    }
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionResult.transactionId);
    // You could add a toast notification here
  };

  const shareTransaction = () => {
    const shareText = `✅ Transaction Successful!\n\nAmount: ${formatEthiopianBirr(transactionResult.amount)}\nTransaction ID: ${transactionResult.transactionId}\nDate: ${new Date(transactionResult.timestamp).toLocaleString()}\n\nSent via Nile Pay 🇪🇹`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Nile Pay Transaction',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-4">
            {/* Success Icon */}
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                {getIcon()}
              </div>
            </div>
            
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-center">
              {getSuccessMessage()}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center mb-3">
              <p className="text-sm text-green-600 mb-1">Amount Sent</p>
              <p className="text-3xl font-bold text-green-800">
                {formatEthiopianBirr(transactionResult.amount)}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              {transactionResult.recipientName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium text-gray-900">{transactionResult.recipientName}</span>
                </div>
              )}
              
              {transactionResult.recipientInfo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Details:</span>
                  <span className="font-medium text-gray-900">{transactionResult.recipientInfo}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium text-gray-900">{transactionResult.senderAccountName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(transactionResult.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  {transactionResult.transactionId}
                </p>
              </div>
              <Button
                onClick={copyTransactionId}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Transaction Completed
                </p>
                <p className="text-xs text-blue-700">
                  Your transaction has been processed successfully. You can view this transaction in your transaction history.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={shareTransaction}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>

        {/* Ethiopian Flag Footer */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold text-green-600">Nile Pay</span> 🇪🇹
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionSuccessDialog;
