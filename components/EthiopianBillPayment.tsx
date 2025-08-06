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
import { processEthiopianBillPayment } from '@/lib/actions/transaction.actions';
import { formatEthiopianBirr } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';
import TransactionSuccessDialog from './TransactionSuccessDialog';

const billPaymentSchema = z.object({
  billProvider: z.string().min(1, 'Please select a bill provider'),
  billAccount: z.string().min(1, 'Please enter your account number'),
  amount: z.number().min(1, 'Amount must be at least 1 ETB').max(100000, 'Amount too large'),
  billType: z.string().min(1, 'Please select bill type'),
});

type BillPaymentFormData = z.infer<typeof billPaymentSchema>;

interface EthiopianBillPaymentProps {
  user: any;
  accounts: any[];
  onSuccess?: () => void;
}

const ethiopianBillProviders = [
  { id: 'eepco', name: 'Ethiopian Electric Power Corporation (EEPCO)', icon: '⚡', type: 'Electricity' },
  { id: 'ethio_telecom', name: 'Ethio Telecom', icon: '📞', type: 'Telecommunications' },
  { id: 'addis_water', name: 'Addis Ababa Water & Sewerage Authority', icon: '💧', type: 'Water' },
  { id: 'safaricom', name: 'Safaricom Ethiopia', icon: '📱', type: 'Mobile' },
  { id: 'dstv', name: 'DStv Ethiopia', icon: '📺', type: 'Entertainment' },
  { id: 'multichoice', name: 'MultiChoice Ethiopia', icon: '🎬', type: 'Entertainment' },
  { id: 'ethiopian_airlines', name: 'Ethiopian Airlines', icon: '✈️', type: 'Travel' },
  { id: 'cbe_insurance', name: 'CBE Insurance', icon: '🛡️', type: 'Insurance' },
];

const EthiopianBillPayment = ({ user, accounts, onSuccess }: EthiopianBillPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const form = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      billProvider: '',
      billAccount: '',
      amount: 0,
      billType: '',
    },
  });

  const onSubmit = async (data: BillPaymentFormData) => {
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

    // Prepare transaction data for confirmation
    setPendingTransaction({
      type: 'bill_payment',
      amount: data.amount,
      billProvider: data.billProvider,
      billAccount: data.billAccount,
      billType: data.billType,
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
      const result = await processEthiopianBillPayment({
        senderId: user.$id || user.id,
        senderBankId: selectedAccount,
        billProvider: pendingTransaction.formData.billProvider,
        billAccount: pendingTransaction.formData.billAccount,
        amount: pendingTransaction.formData.amount,
        billType: pendingTransaction.formData.billType,
      });

      if (result.success) {
        // Prepare success data
        setTransactionResult({
          type: 'bill_payment',
          amount: pendingTransaction.amount,
          transactionId: result.transaction.transaction_id || `BP${Date.now()}`,
          timestamp: new Date().toISOString(),
          recipientName: pendingTransaction.billProvider,
          recipientInfo: `${pendingTransaction.billType} - ${pendingTransaction.billAccount}`,
          senderAccountName: pendingTransaction.senderAccountName,
          senderBankName: pendingTransaction.senderBankName,
        });

        form.reset();
        setSelectedAccount(accounts[0]?.id || '');
        setShowSuccess(true);
        onSuccess?.();
      } else {
        alert(`Bill payment failed: ${result.error}`);
      }
    } catch (error) {
      alert('Bill payment failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingTransaction(null);
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const selectedProvider = ethiopianBillProviders.find(p => p.id === form.watch('billProvider'));

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl flex-shrink-0">💳</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold truncate">Bill Payment</CardTitle>
            <CardDescription className="text-blue-100 text-sm sm:text-base">
              Pay your bills instantly with local service providers
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Account Selection */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🏦</span>
            Select Payment Account
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
                    <span className="font-semibold text-blue-600">
                      {formatEthiopianBirr(account.balance)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAccountData && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Available Balance: <span className="font-semibold text-blue-600 dark:text-blue-400">
                {formatEthiopianBirr(selectedAccountData.balance)}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Bill Provider Selection */}
            <FormField
              control={form.control}
              name="billProvider"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                    <span>🏢</span>
                    Bill Provider
                  </FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const provider = ethiopianBillProviders.find(p => p.id === value);
                    if (provider) {
                      form.setValue('billType', provider.type);
                    }
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select service provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ethiopianBillProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{provider.icon}</span>
                            <div>
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-xs text-gray-500">{provider.type}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              )}
            />

            {/* Account Number and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="billAccount"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🔢</span>
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your account number"
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

            {/* Bill Type (Hidden) */}
            <FormField
              control={form.control}
              name="billType"
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />

            {/* Selected Provider Info */}
            {selectedProvider && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedProvider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedProvider.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProvider.type} Service</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg touch-manipulation cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <span className="mr-2">💳</span>
                  Pay Bill
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Service Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Service Providers</p>
              <p>
                Bill payments are processed instantly for most local service providers.
                Please keep your receipt for your records.
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

export default EthiopianBillPayment;
