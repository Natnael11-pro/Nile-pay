'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { processEthiopianMoneyTransfer } from '@/lib/actions/transaction.actions';
import { formatEthiopianBirr, ethiopianBanks } from '@/lib/utils';
import { formatEthiopianPhoneNumber } from '@/lib/utils/phoneFormatter';
import { Loader2 } from 'lucide-react';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';
import TransactionSuccessDialog from './TransactionSuccessDialog';

const transferSchema = z.object({
  receiverName: z.string().min(2, 'Receiver name must be at least 2 characters'),
  receiverAccountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(20, 'Account number too long'),
  receiverBank: z.string().min(1, 'Please select a bank'),
  amount: z.number().min(1, 'Amount must be at least 1 ETB').max(1000000, 'Amount too large'),
  description: z.string().min(1, 'Please enter a description'),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface EthiopianMoneyTransferProps {
  user: any;
  accounts: any[];
  onSuccess?: () => void;
}

const EthiopianMoneyTransfer = ({ user, accounts, onSuccess }: EthiopianMoneyTransferProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      receiverName: '',
      receiverAccountNumber: '',
      receiverBank: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (data: TransferFormData) => {
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

    // Prepare transaction data for confirmation
    setPendingTransaction({
      type: 'money_transfer',
      amount: data.amount,
      description: data.description,
      receiverName: data.receiverName,
      receiverBank: data.receiverBank,
      receiverAccountNumber: data.receiverAccountNumber,
      senderAccountName: selectedAccountData?.account_name,
      senderBankName: selectedAccountData?.bank_name,
      formData: data
    });

    setShowConfirmation(true);
  };

  const handleConfirmTransaction = async () => {
    if (!pendingTransaction) return;

    setIsLoading(true);
    setShowConfirmation(false);

    try {
      const result = await processEthiopianMoneyTransfer({
        senderId: user.$id || user.id,
        senderBankId: selectedAccount,
        receiverName: pendingTransaction.formData.receiverName,
        receiverPhone: pendingTransaction.formData.receiverAccountNumber,
        receiverBank: pendingTransaction.formData.receiverBank,
        amount: pendingTransaction.formData.amount,
        description: pendingTransaction.formData.description,
      });

      if (result.success) {
        // Prepare success data
        setTransactionResult({
          type: 'money_transfer',
          amount: pendingTransaction.amount,
          transactionId: result.transaction.transaction_id || `MT${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: pendingTransaction.description,
          recipientName: pendingTransaction.receiverName,
          recipientInfo: `${pendingTransaction.receiverBank} - ${pendingTransaction.receiverAccountNumber}`,
          senderAccountName: pendingTransaction.senderAccountName,
          senderBankName: pendingTransaction.senderBankName,
        });

        form.reset();
        setSelectedAccount(accounts[0]?.id || '');
        setShowSuccess(true);
        onSuccess?.();
      } else {
        alert(`Transfer failed: ${result.error}`);
      }
    } catch (error) {
      alert('Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingTransaction(null);
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  return (
    <Card className="w-full bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl flex-shrink-0">🇪🇹</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold truncate">Local Money Transfer</CardTitle>
            <CardDescription className="text-green-100 text-sm sm:text-base">
              Send money instantly to any local bank account
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Account Selection */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-100 dark:border-green-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
            <span>🏦</span>
            <span className="truncate">Select Source Account</span>
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
                    <span className="font-semibold text-green-600">
                      {formatEthiopianBirr(account.balance)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAccountData && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Available Balance: <span className="font-semibold text-green-600 dark:text-green-400">
                {formatEthiopianBirr(selectedAccountData.balance)}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Receiver Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>👤</span>
                      Receiver Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter receiver's full name"
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="receiverAccountNumber"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🏦</span>
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account number"
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Bank and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="receiverBank"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🏦</span>
                      Receiver Bank
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ethiopianBanks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.name}>
                            <div className="flex items-center gap-2">
                              <span>{bank.flag}</span>
                              <span>{bank.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>💰</span>
                      Amount (ETB)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="mt-2"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                    <span>📝</span>
                    Transfer Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What is this transfer for?"
                      className="mt-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base rounded-lg touch-manipulation cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Transfer...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Send Money
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Local Banking Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Local Banking Network</p>
              <p>
                Transfers are processed instantly within the local banking network.
                International transfers may take 1-3 business days.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

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

      {/* Success Dialog */}
      {transactionResult && (
        <TransactionSuccessDialog
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            setTransactionResult(null);
          }}
          transactionResult={transactionResult}
        />
      )}
    </Card>
  );
};

export default EthiopianMoneyTransfer;
