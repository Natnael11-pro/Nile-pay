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
import { processEthiopianMobileMoneyTransfer } from '@/lib/actions/transaction.actions';
import { formatEthiopianBirr } from '@/lib/utils';
import { formatEthiopianPhoneNumber } from '@/lib/utils/phoneFormatter';
import { Loader2 } from 'lucide-react';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';
import TransactionSuccessDialog from './TransactionSuccessDialog';

const mobileMoneySchema = z.object({
  recipientName: z.string().min(2, 'Recipient name must be at least 2 characters'),
  recipientPhone: z.string().regex(/^(\+251|0)[79]\d{8}$/, 'Please enter a valid Ethiopian phone number'),
  mobileProvider: z.string().min(1, 'Please select a mobile money provider'),
  amount: z.number().min(1, 'Amount must be at least 1 ETB').max(50000, 'Amount too large for mobile money'),
});

type MobileMoneyFormData = z.infer<typeof mobileMoneySchema>;

interface EthiopianMobileMoneyTransferProps {
  user: any;
  accounts: any[];
  onSuccess?: () => void;
}

const ethiopianMobileProviders = [
  { id: 'm_birr', name: 'M-Birr', icon: '📱', color: 'bg-orange-500', description: 'National Bank of Ethiopia' },
  { id: 'hello_cash', name: 'HelloCash', icon: '💰', color: 'bg-blue-500', description: 'Cooperative Bank of Oromia' },
  { id: 'amole', name: 'Amole', icon: '🏦', color: 'bg-green-500', description: 'Dashen Bank' },
  { id: 'cbe_birr', name: 'CBE Birr', icon: '🏛️', color: 'bg-purple-500', description: 'Commercial Bank of Ethiopia' },
  { id: 'telebirr', name: 'TeleBirr', icon: '📞', color: 'bg-red-500', description: 'Ethio Telecom' },
];

const EthiopianMobileMoneyTransfer = ({ user, accounts, onSuccess }: EthiopianMobileMoneyTransferProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const form = useForm<MobileMoneyFormData>({
    resolver: zodResolver(mobileMoneySchema),
    defaultValues: {
      recipientName: '',
      recipientPhone: '',
      mobileProvider: '',
      amount: 0,
    },
  });

  const onSubmit = async (data: MobileMoneyFormData) => {
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
    const formattedPhone = formatEthiopianPhoneNumber(data.recipientPhone);

    // Prepare transaction data for confirmation
    setPendingTransaction({
      type: 'mobile_money',
      amount: data.amount,
      recipientName: data.recipientName,
      recipientPhone: formattedPhone,
      mobileProvider: data.mobileProvider,
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
      const result = await processEthiopianMobileMoneyTransfer({
        senderId: user.$id || user.id,
        senderBankId: selectedAccount,
        recipientName: pendingTransaction.formData.recipientName,
        recipientPhone: pendingTransaction.recipientPhone,
        amount: pendingTransaction.formData.amount,
        mobileProvider: pendingTransaction.formData.mobileProvider,
      });

      if (result.success) {
        // Prepare success data
        setTransactionResult({
          type: 'mobile_money',
          amount: pendingTransaction.amount,
          transactionId: result.transaction.transaction_id || `MM${Date.now()}`,
          timestamp: new Date().toISOString(),
          recipientName: pendingTransaction.recipientName,
          recipientInfo: `${pendingTransaction.mobileProvider} - ${pendingTransaction.recipientPhone}`,
          senderAccountName: pendingTransaction.senderAccountName,
          senderBankName: pendingTransaction.senderBankName,
        });

        form.reset();
        setSelectedAccount(accounts[0]?.id || '');
        setShowSuccess(true);
        onSuccess?.();
      } else {
        alert(`Mobile money transfer failed: ${result.error}`);
      }
    } catch (error) {
      alert('Mobile money transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingTransaction(null);
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const selectedProvider = ethiopianMobileProviders.find(p => p.id === form.watch('mobileProvider'));

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl flex-shrink-0">📱</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold truncate">Mobile Money</CardTitle>
            <CardDescription className="text-purple-100 text-sm sm:text-base">
              Send money to mobile wallets instantly
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Account Selection */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🏦</span>
            Select Source Account
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
                    <span className="font-semibold text-purple-600">
                      {formatEthiopianBirr(account.balance)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAccountData && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Available Balance: <span className="font-semibold text-purple-600 dark:text-purple-400">
                {formatEthiopianBirr(selectedAccountData.balance)}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Mobile Provider Selection */}
            <FormField
              control={form.control}
              name="mobileProvider"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                    <span>📱</span>
                    Mobile Money Provider
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select mobile money provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ethiopianMobileProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{provider.icon}</span>
                            <div>
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-xs text-gray-500">{provider.description}</div>
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

            {/* Recipient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>👤</span>
                      Recipient Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter recipient's full name"
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
                name="recipientPhone"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>📞</span>
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+251912345678"
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Amount */}
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
                  <div className="mt-1 text-xs text-gray-500">
                    Mobile money limit: ETB 50,000 per transaction
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            {/* Selected Provider Info */}
            {selectedProvider && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedProvider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedProvider.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProvider.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg touch-manipulation cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Transfer...
                </>
              ) : (
                <>
                  <span className="mr-2">📱</span>
                  Send to Mobile Wallet
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Mobile Money Notice */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-orange-600">📱</span>
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">Mobile Money Network</p>
              <p>
                Mobile money transfers are processed instantly. Recipients will receive an SMS notification
                and can withdraw cash from authorized agents nationwide.
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

export default EthiopianMobileMoneyTransfer;
