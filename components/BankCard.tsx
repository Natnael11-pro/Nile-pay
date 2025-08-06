'use client';

import { formatEthiopianBirr } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Copy from './Copy'
import { Button } from './ui/button'
import { Trash2, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import DisconnectAccountConfirmation from './DisconnectAccountConfirmation'
import SuccessDialog from './SuccessDialog'
import { deleteBankAccount } from '@/lib/actions/bank.actions'
import { useRouter } from 'next/navigation'
import { Unlink } from 'lucide-react'

const BankCard = ({ account, userName, showBalance = true }: CreditCardProps) => {
  const [showDisconnectConfirmation, setShowDisconnectConfirmation] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const handleDisconnectAccount = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch(`/api/bank-accounts/${account.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setShowDisconnectConfirmation(false);
        setShowSuccessDialog(true);
      } else {
        alert(result.error || 'Failed to disconnect account');
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account. Please try again.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Link href={`/transaction-history/?id=${account.id}`} className="relative group">
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl border border-green-400/20 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          {/* Account Actions Dropdown */}
          <div className="absolute top-4 right-4 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDisconnectConfirmation(true);
                  }}
                  className="text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Ethiopian Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-4xl">🇪🇹</div>
            <div className="absolute bottom-4 left-4 text-2xl">🏦</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-5">💳</div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                {/* Account Name - User's custom name */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-300">💳</span>
                  <h1 className="text-lg font-bold text-white">
                    {account.account_name || 'My Account'}
                  </h1>
                </div>
                {/* Bank Name */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-300">🏦</span>
                  <p className="text-sm text-green-100">
                    {account.bank_name || account.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-sm">ETB</span>
                  <p className="font-bold text-2xl text-white">
                    {formatEthiopianBirr(account.balance || account.currentBalance || 0)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-100 mb-1">Account Type</div>
                <div className="text-sm font-semibold text-white capitalize">
                  {account.account_type || 'Savings'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-green-100 mb-1">Account Holder</div>
                <div className="text-sm font-semibold text-white">
                  {userName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-100 mb-1">Account Number</div>
                <div className="text-sm font-mono text-white tracking-wider">
                  {account.account_number || account?.mask || 'N/A'}
                </div>
              </div>
            </div>

            {/* Ethiopian Banking Indicators */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300">⚡</span>
                <span className="text-xs text-green-100">Instant Transfer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-300">🔒</span>
                <span className="text-xs text-green-100">Bank Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-300">🇪🇹</span>
                <span className="text-xs text-green-100">Ethiopian Bank</span>
              </div>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      </Link>

      {showBalance && <Copy title={account?.account_number || account?.sharaebleId} />}

      {/* Disconnect Confirmation Dialog */}
      <DisconnectAccountConfirmation
        isOpen={showDisconnectConfirmation}
        onClose={() => setShowDisconnectConfirmation(false)}
        onConfirm={handleDisconnectAccount}
        account={account}
        isLoading={isDisconnecting}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          router.refresh();
        }}
        title="Account Disconnected"
        message="Your bank account has been successfully disconnected from Nile Pay."
        details={[
          `Account: ${account.account_name || account.name}`,
          `Bank: ${account.bank_name}`,
          `Account Number: ${account.account_number}`,
          'You can reconnect this account anytime from the My Banks page.'
        ]}
        icon={<Unlink className="h-6 w-6 text-orange-500" />}
        color="orange"
        actionLabel="Continue"
      />
    </div>
  )
}

export default BankCard