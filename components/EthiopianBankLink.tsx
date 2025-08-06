'use client';

import React, { useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ethiopianBanks, generateEthiopianAccountNumber, formatEthiopianBirr } from '@/lib/utils';
import { createBankAccount } from '@/lib/actions/bank.actions';

interface EthiopianBankLinkProps {
  user: any;
  variant?: 'primary' | 'ghost' | 'default';
}

const EthiopianBankLink = ({ user, variant = 'default' }: EthiopianBankLinkProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountType, setAccountType] = useState('');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [accountName, setAccountName] = useState('');

  const handleConnectBank = async () => {
    if (!selectedBank || !accountType || !accountName.trim()) return;

    setIsLoading(true);
    try {
      const bank = ethiopianBanks.find(b => b.code === selectedBank);
      if (!bank) return;

      const accountNumber = generateEthiopianAccountNumber(bank.code);

      await createBankAccount({
        userId: user.id || user.$id,
        bankName: bank.name,
        accountType,
        isPrimary: false,
        accountName: accountName.trim(),
        initialBalance: parseFloat(initialBalance) || 0
      });

      setIsOpen(false);
      setSelectedBank('');
      setAccountType('');
      setAccountName('');
      setInitialBalance('1000');
      router.refresh();
    } catch (error) {
      console.error('Error connecting bank:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ButtonContent = () => (
    <>
      <Image 
        src="/icons/connect-bank.svg"
        alt="connect bank"
        width={24}
        height={24}
      />
      <p className={variant === 'ghost' ? 'hidden text-xs font-semibold text-black-2 xl:block' : 'text-xs font-semibold text-black-2 truncate'}>
        Connect Bank
      </p>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === 'primary' ? (
          <Button className="plaidlink-primary">
            Connect Ethiopian Bank
          </Button>
        ) : variant === 'ghost' ? (
          <Button variant="ghost" className="plaidlink-ghost">
            <ButtonContent />
          </Button>
        ) : (
          <Button className="plaidlink-default w-full text-xs">
            <ButtonContent />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-600">
            Connect Your Bank Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., My Savings Account, Business Account"
              maxLength={50}
            />
            <p className="text-sm text-gray-500">
              Give your account a memorable name (up to 50 characters)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bank">Select Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                {ethiopianBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: bank.color }}
                      />
                      {bank.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="business">Business Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="balance">Initial Balance (ETB)</Label>
            <Input
              id="balance"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="Enter initial balance"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-gray-500">
              Demo balance: {formatEthiopianBirr(parseFloat(initialBalance) || 0)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnectBank}
            disabled={!selectedBank || !accountType || !accountName.trim() || isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Connecting...' : 'Connect Account'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EthiopianBankLink;
