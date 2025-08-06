'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Send, User, Lock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';
import { BankDropdown } from './BankDropdown';

import TransferSuccessDialog from './TransferSuccessDialog';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';
import TransactionSuccessDialog from './TransactionSuccessDialog';

const transferSchema = z.object({
  receiverEmail: z.string().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Amount must be at least 1 ETB').max(100000, 'Amount cannot exceed 100,000 ETB'),
  description: z.string().min(1, 'Please provide a description').max(200, 'Description too long'),
  senderBankId: z.string().min(1, 'Please select your account'),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface UserToUserTransferProps {
  user: any;
  accounts: any[];
}

const UserToUserTransfer = ({ user, accounts }: UserToUserTransferProps) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState<any>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferResult, setTransferResult] = useState<any>(null);
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false);
  const [noAccountError, setNoAccountError] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [showNewSuccess, setShowNewSuccess] = useState(false);
  const [newTransactionResult, setNewTransactionResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const watchedEmail = watch('receiverEmail');
  const watchedAmount = watch('amount');

  // Handle URL parameters for pre-filling form (from QR scan)
  useEffect(() => {
    const recipientId = searchParams.get('recipientId');
    const recipient = searchParams.get('recipient');
    const amount = searchParams.get('amount');
    const description = searchParams.get('description');
    const account = searchParams.get('account');

    if (recipientId && recipient && amount) {
      // Pre-fill form with QR data
      setValue('amount', parseFloat(amount));
      setValue('description', description || 'QR Payment');

      // If account is specified, set it as sender account
      if (account) {
        setValue('senderBankId', account);
      }

      // Set recipient info directly (simulating a successful lookup)
      const names = recipient.split(' ');
      setReceiverInfo({
        id: recipientId,
        firstName: names[0] || recipient,
        lastName: names.slice(1).join(' ') || '',
        email: `user_${recipientId}@nilepay.com` // Placeholder email
      });
    }
  }, [searchParams, setValue]);

  // Look up user by email
  const lookupUser = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const userData = await response.json();
        setReceiverInfo(userData);
      } else {
        setReceiverInfo(null);
      }
    } catch (error) {
      console.error('Error looking up user:', error);
      setReceiverInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email input change with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedEmail && watchedEmail !== user.email) {
        lookupUser(watchedEmail);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail, user.email]);

  const onSubmit = async (data: TransferFormData) => {
    if (!receiverInfo) {
      alert('Please select a valid recipient');
      return;
    }

    const selectedAccount = accounts.find(acc => acc.id === data.senderBankId);

    // Prepare transaction data for confirmation
    setPendingTransaction({
      type: 'user_transfer',
      amount: data.amount,
      description: data.description,
      recipientFullName: `${receiverInfo.firstName} ${receiverInfo.lastName}`,
      recipientEmail: receiverInfo.email,
      senderAccountName: selectedAccount?.account_name || 'My Account',
      senderBankName: selectedAccount?.bank_name || 'Nile Pay',
      formData: data
    });

    setShowConfirmation(true);
  };

  const handleConfirmTransaction = async () => {
    if (!pendingTransaction) return;

    setIsLoading(true);
    setShowConfirmation(false);

    try {
      // Process transfer directly without OTP
      const response = await fetch('/api/transfers/user-to-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingTransaction.formData,
          receiverId: receiverInfo.id,
          senderId: user.id || user.$id,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Prepare new success data
        setNewTransactionResult({
          type: 'user_transfer',
          amount: pendingTransaction.amount,
          transactionId: result.transferId || `UT${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: pendingTransaction.description,
          recipientName: pendingTransaction.recipientFullName,
          recipientInfo: pendingTransaction.recipientEmail,
          senderAccountName: pendingTransaction.senderAccountName,
          senderBankName: pendingTransaction.senderBankName,
        });

        reset();
        setReceiverInfo(null);
        setShowNewSuccess(true);
      } else {
        const error = await response.json();

        // Handle specific error for recipient without account
        if (error.error === 'RECIPIENT_NO_ACCOUNT') {
          setNoAccountError(error);
          setShowNoAccountDialog(true);
          return;
        }

        throw new Error(error.message || error.error || 'Transfer failed');
      }
    } catch (error: any) {
      console.error('Error processing transfer:', error);
      alert(error.message || 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingTransaction(null);
    }
  };



  return (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Send className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-800">Send Money to Another User</CardTitle>
              <CardDescription className="text-green-600">
                Transfer money instantly to other Nile Pay users
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Receiver Email */}
            <div className="space-y-2">
              <Label htmlFor="receiverEmail" className="text-sm font-medium">
                Recipient Email Address *
              </Label>
              <Input
                id="receiverEmail"
                type="email"
                placeholder="Enter recipient's email address"
                {...register('receiverEmail')}
                className="border-gray-300 focus:border-green-500"
              />
              {errors.receiverEmail && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.receiverEmail.message}
                </p>
              )}

              {/* Receiver Info Display */}
              {watchedEmail && watchedEmail !== user.email && (
                <div className="mt-3">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      Looking up user...
                    </div>
                  ) : receiverInfo ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          {receiverInfo.firstName} {receiverInfo.lastName}
                        </p>
                        <p className="text-sm text-green-600">Nile Pay User</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    </div>
                  ) : watchedEmail.includes('@') ? (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-600">
                        User not found. Please check the email address.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {watchedEmail === user.email && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm text-yellow-600">
                    You cannot send money to yourself.
                  </p>
                </div>
              )}
            </div>

            {/* Sender Account Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">From Account *</Label>
              <Select
                value={watch('senderBankId') || ''}
                onValueChange={(value) => setValue('senderBankId', value, { shouldValidate: true })}
              >
                <SelectTrigger className="border-gray-300 focus:border-green-500">
                  <SelectValue placeholder="Select your account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <p className="font-medium">{account.account_name || account.name}</p>
                        <p className="text-sm text-green-600">
                          {account.bank_name} • {formatEthiopianBirr(account.balance || account.currentBalance)}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.senderBankId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.senderBankId.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (ETB) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                max="100000"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className="border-gray-300 focus:border-green-500"
              />
              {watchedAmount > 0 && (
                <p className="text-sm text-green-600">
                  Amount: {formatEthiopianBirr(watchedAmount)}
                </p>
              )}
              {errors.amount && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="What's this transfer for?"
                {...register('description')}
                className="border-gray-300 focus:border-green-500 min-h-[80px]"
                maxLength={200}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!receiverInfo || watchedEmail === user.email || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Transfer...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Money
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {pendingTransaction && (
        <TransactionConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setPendingTransaction(null);
          }}
          onConfirm={handleConfirmTransaction}
          transactionData={pendingTransaction}
          isProcessing={isLoading}
        />
      )}

      {/* New Success Dialog */}
      {newTransactionResult && (
        <TransactionSuccessDialog
          isOpen={showNewSuccess}
          onClose={() => {
            setShowNewSuccess(false);
            setNewTransactionResult(null);
          }}
          transactionResult={newTransactionResult}
        />
      )}

      {/* No Account Dialog */}
      <Dialog open={showNoAccountDialog} onOpenChange={setShowNoAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Recipient Cannot Receive Money
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              The recipient needs to link a bank account before they can receive transfers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {noAccountError && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">
                      {noAccountError.recipientName}
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      {noAccountError.recipientEmail}
                    </p>
                    <p className="text-sm text-orange-700 mt-2">
                      {noAccountError.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 mb-2">
                    What can the recipient do?
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Sign in to their Nile Pay account</li>
                    <li>• Go to "My Banks" section</li>
                    <li>• Add a bank account</li>
                    <li>• Then they can receive money transfers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 mb-1">
                    Important Note
                  </p>
                  <p className="text-sm text-yellow-700">
                    You cannot receive money transfers without linking at least one bank account to your Nile Pay profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                setShowNoAccountDialog(false);
                setNoAccountError(null);
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <TransferSuccessDialog
        isOpen={transferSuccess}
        onClose={() => {
          setTransferSuccess(false);
          setTransferResult(null);
        }}
        transferData={transferResult}
      />
    </div>
  );
};

export default UserToUserTransfer;
