'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';

interface DisconnectAccountConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  account: {
    id: string;
    account_name?: string;
    name?: string;
    bank_name?: string;
    bankName?: string;
    balance?: number;
    currentBalance?: number;
    account_type?: string;
    accountType?: string;
  } | null;
  isLoading?: boolean;
}

const DisconnectAccountConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  account,
  isLoading = false
}: DisconnectAccountConfirmationProps) => {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = 'DISCONNECT';

  const handleConfirm = async () => {
    if (confirmText === expectedText) {
      await onConfirm();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!account) return null;

  const canDisconnect = confirmText === expectedText;
  const accountBalance = account.balance || account.currentBalance || 0;
  const accountName = account.account_name || account.name || 'Unknown Account';
  const bankName = account.bank_name || account.bankName || 'Unknown Bank';
  const accountType = account.account_type || account.accountType || 'Unknown Type';
  const hasBalance = accountBalance > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Disconnect Bank Account
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This will disconnect your bank account from Nile Pay. You can reconnect it later if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Details */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Account to Disconnect:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {accountName}</p>
              <p><span className="font-medium">Bank:</span> {bankName}</p>
              <p><span className="font-medium">Type:</span> {accountType}</p>
              <p><span className="font-medium">Balance:</span>
                <span className={`ml-1 font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                  {formatEthiopianBirr(accountBalance)}
                </span>
              </p>
            </div>
          </div>

          {/* Warning for accounts with balance */}
          {hasBalance && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">Account Has Balance</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This account has a balance of {formatEthiopianBirr(accountBalance)}.
                    You can still disconnect it, but make sure to transfer funds to another account first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Requirements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Important Information</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• This will disconnect the account from Nile Pay</li>
                  <li>• All transaction history will be preserved</li>
                  <li>• You can reconnect this account later if needed</li>
                  <li>• You must have at least one account remaining</li>
                  {hasBalance && <li>• Consider transferring your balance first</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label htmlFor="confirmText" className="text-sm font-medium text-gray-700">
              Type <span className="font-bold text-orange-600">DISCONNECT</span> to confirm:
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DISCONNECT to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!canDisconnect || isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Disconnecting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Disconnect Account
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 text-center pt-2">
            Need help? Contact our support team if you have questions about disconnecting your account.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisconnectAccountConfirmation;
