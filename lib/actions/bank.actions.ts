'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { generateEthiopianAccountNumber } from '@/lib/utils';

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBankAccountParams {
  userId: string;
  bankName: string;
  accountName: string;
  accountType: string;
  isPrimary?: boolean;
  initialBalance?: number;
}

// Create a new bank account
export const createBankAccount = async (params: CreateBankAccountParams): Promise<BankAccount | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { userId, bankName, accountName, accountType, isPrimary = false, initialBalance = 0 } = params;

    // Generate Ethiopian account number
    const accountNumber = generateEthiopianAccountNumber('ETH');

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({
        user_id: userId,
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        account_type: accountType,
        balance: initialBalance,
        currency: 'ETB',
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bank account:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Bank account creation error:', error);
    return null;
  }
};

// Get user's bank accounts
export const getAccounts = async (userId: string): Promise<BankAccount[]> => {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get accounts error:', error);
    return [];
  }
};

// Get a specific account
export const getAccount = async (accountId: string): Promise<BankAccount | null> => {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) {
      console.error('Error fetching account:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get account error:', error);
    return null;
  }
};

// Update account balance
export const updateAccountBalance = async (accountId: string, newBalance: number): Promise<boolean> => {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (error) {
      console.error('Error updating account balance:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Update balance error:', error);
    return false;
  }
};

// Set primary account
export const setPrimaryAccount = async (userId: string, accountId: string): Promise<boolean> => {
  try {
    const supabase = await createServerSupabaseClient();

    // First, set all accounts to non-primary
    await supabase
      .from('bank_accounts')
      .update({ is_primary: false })
      .eq('user_id', userId);

    // Then set the selected account as primary
    const { error } = await supabase
      .from('bank_accounts')
      .update({ is_primary: true })
      .eq('id', accountId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting primary account:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Set primary account error:', error);
    return false;
  }
};

// Delete account
export const deleteBankAccount = async (accountId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/bank-accounts/${accountId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete account');
    }

    return { success: true, message: result.message };
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return { success: false, message: error.message || 'Failed to delete account' };
  }
};

// Get transactions for an account
export const getTransactions = async (accountId: string, page: number = 1, limit: number = 10) => {
  try {
    const supabase = await createServerSupabaseClient();

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('transactions')
      .select(`
        *,
        bank_accounts!inner(account_name, bank_name)
      `, { count: 'exact' })
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching transactions:', error);
      return { transactions: [], totalCount: 0 };
    }

    // Transform data to match expected format
    const transactions = data?.map(transaction => ({
      id: transaction.id,
      $id: transaction.id,
      name: transaction.recipient_name || transaction.sender_name || transaction.description || 'Transaction',
      paymentChannel: 'online',
      type: transaction.transaction_type,
      accountId: transaction.account_id,
      amount: transaction.transaction_type === 'credit' ? transaction.amount : -transaction.amount,
      pending: transaction.status === 'pending',
      category: transaction.type || 'Transfer',
      date: transaction.created_at, // Keep full datetime for proper date handling
      image: '',
      $createdAt: transaction.created_at,
      channel: 'online',
      senderBankId: '',
      receiverBankId: '',
      description: transaction.description,
      recipient_email: transaction.recipient_email,
      sender_email: transaction.sender_email,
      transaction_id: transaction.transaction_id,
      status: transaction.status,
      account_name: transaction.bank_accounts?.account_name
    })) || [];

    return {
      transactions,
      totalCount: count || 0
    };
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return { transactions: [], totalCount: 0 };
  }
};

// Get total balance across all accounts
export const getTotalBalance = async (userId: string): Promise<number> => {
  try {
    const accounts = await getAccounts(userId);
    return accounts.reduce((total, account) => total + account.balance, 0);
  } catch (error) {
    console.error('Get total balance error:', error);
    return 0;
  }
};
