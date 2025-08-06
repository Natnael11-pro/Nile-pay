'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, AlertTriangle, X, Send, CreditCard, Smartphone, QrCode, Users } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';

interface TransactionData {
  type: 'money_transfer' | 'bill_payment' | 'mobile_money' | 'qr_payment' | 'user_transfer';
  amount: number;
  description?: string;
  
  // Money Transfer specific
  receiverName?: string;
  receiverBank?: string;
  receiverAccountNumber?: string;
  
  // Bill Payment specific
  billProvider?: string;
  billAccount?: string;
  billType?: string;
  
  // Mobile Money specific
  recipientName?: string;
  recipientPhone?: string;
  mobileProvider?: string;
  
  // QR Payment specific
  qrData?: any;
  
  // User Transfer specific
  recipientEmail?: string;
  recipientFullName?: string;
  
  // Common
  senderAccountName?: string;
  senderBankName?: string;
}

interface TransactionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionData: TransactionData;
  isProcessing?: boolean;
}

const TransactionConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  transactionData,
  isProcessing = false
}: TransactionConfirmationDialogProps) => {
  const getIcon = () => {
    switch (transactionData.type) {
      case 'money_transfer':
        return <Send className="h-6 w-6 text-green-600" />;
      case 'bill_payment':
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case 'mobile_money':
        return <Smartphone className="h-6 w-6 text-purple-600" />;
      case 'qr_payment':
        return <QrCode className="h-6 w-6 text-orange-600" />;
      case 'user_transfer':
        return <Users className="h-6 w-6 text-emerald-600" />;
      default:
        return <Send className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTitle = () => {
    switch (transactionData.type) {
      case 'money_transfer':
        return 'Confirm Money Transfer';
      case 'bill_payment':
        return 'Confirm Bill Payment';
      case 'mobile_money':
        return 'Confirm Mobile Money Transfer';
      case 'qr_payment':
        return 'Confirm QR Payment';
      case 'user_transfer':
        return 'Confirm User Transfer';
      default:
        return 'Confirm Transaction';
    }
  };

  const getColor = () => {
    switch (transactionData.type) {
      case 'money_transfer':
        return 'green';
      case 'bill_payment':
        return 'blue';
      case 'mobile_money':
        return 'purple';
      case 'qr_payment':
        return 'orange';
      case 'user_transfer':
        return 'emerald';
      default:
        return 'gray';
    }
  };

  const color = getColor();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${
              color === 'green' ? 'bg-green-100' :
              color === 'blue' ? 'bg-blue-100' :
              color === 'purple' ? 'bg-purple-100' :
              color === 'orange' ? 'bg-orange-100' :
              color === 'emerald' ? 'bg-emerald-100' :
              'bg-gray-100'
            }`}>
              {getIcon()}
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getTitle()}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Please review and confirm your transaction details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount */}
          <div className={`rounded-lg p-4 border ${
            color === 'green' ? 'bg-green-50 border-green-200' :
            color === 'blue' ? 'bg-blue-50 border-blue-200' :
            color === 'purple' ? 'bg-purple-50 border-purple-200' :
            color === 'orange' ? 'bg-orange-50 border-orange-200' :
            color === 'emerald' ? 'bg-emerald-50 border-emerald-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
              <p className={`text-2xl font-bold ${
                color === 'green' ? 'text-green-800' :
                color === 'blue' ? 'text-blue-800' :
                color === 'purple' ? 'text-purple-800' :
                color === 'orange' ? 'text-orange-800' :
                color === 'emerald' ? 'text-emerald-800' :
                'text-gray-800'
              }`}>
                {formatEthiopianBirr(transactionData.amount)}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Money Transfer Details */}
            {transactionData.type === 'money_transfer' && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bank:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.receiverBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.receiverAccountNumber}</span>
                </div>
              </>
            )}

            {/* Bill Payment Details */}
            {transactionData.type === 'bill_payment' && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.billProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.billAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bill Type:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.billType}</span>
                </div>
              </>
            )}

            {/* Mobile Money Details */}
            {transactionData.type === 'mobile_money' && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.recipientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.mobileProvider}</span>
                </div>
              </>
            )}

            {/* User Transfer Details */}
            {transactionData.type === 'user_transfer' && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.recipientFullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{transactionData.recipientEmail}</span>
                </div>
              </>
            )}

            {/* QR Payment Details */}
            {transactionData.type === 'qr_payment' && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">QR Payment:</span>
                <span className="text-sm font-medium text-gray-900">Merchant Payment</span>
              </div>
            )}

            {/* Description */}
            {transactionData.description && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Description:</span>
                <span className="text-sm font-medium text-gray-900">{transactionData.description}</span>
              </div>
            )}

            {/* From Account */}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">From Account:</span>
                <span className="text-sm font-medium text-gray-900">{transactionData.senderAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bank:</span>
                <span className="text-sm font-medium text-gray-900">{transactionData.senderBankName}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Important</p>
                <p className="text-xs text-yellow-700">
                  Please verify all details are correct before confirming. This transaction cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 text-white ${
              color === 'green' ? 'bg-green-600 hover:bg-green-700' :
              color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
              color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
              color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
              color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
              'bg-gray-600 hover:bg-gray-700'
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm & Send
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionConfirmationDialog;
