'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';

interface TransferSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: {
    transferId: string;
    amount: number;
    recipient: string;
    recipientEmail: string;
    description: string;
    senderAccount: string;
  } | null;
}

const TransferSuccessDialog = ({ isOpen, onClose, transferData }: TransferSuccessDialogProps) => {
  const copyTransferId = () => {
    if (transferData?.transferId) {
      navigator.clipboard.writeText(transferData.transferId);
    }
  };

  const viewTransactionHistory = () => {
    onClose();
    window.location.href = '/transaction-history';
  };

  if (!transferData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div>
            <DialogTitle className="text-2xl font-bold text-green-600 mb-2">
              Transfer Successful! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Your money has been sent successfully
            </DialogDescription>
          </div>

          {/* Transfer Details */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-left">
            <h3 className="font-semibold text-gray-800 text-center mb-4">Transfer Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatEthiopianBirr(transferData.amount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">To:</span>
                <div className="text-right">
                  <div className="font-medium text-gray-800">{transferData.recipient}</div>
                  <div className="text-sm text-gray-500">{transferData.recipientEmail}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From:</span>
                <span className="font-medium text-gray-800">{transferData.senderAccount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium text-gray-800 text-right max-w-48 truncate">
                  {transferData.description}
                </span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-800">
                      {transferData.transferId.slice(-8)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTransferId}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-1">📧</div>
              <div className="text-left">
                <h4 className="font-semibold text-blue-800 mb-1">Notifications Sent</h4>
                <p className="text-sm text-blue-700">
                  Both you and the recipient have been notified about this transfer via email.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={viewTransactionHistory}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View History
            </Button>
            
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>

          {/* Ethiopian Banking Footer */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              🇪🇹 Secure Ethiopian Digital Banking • Powered by Nile Pay
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferSuccessDialog;
