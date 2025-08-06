"use server";

import { createServerSupabaseClient, supabaseAdmin } from "../supabase";
import { parseStringify, generateTransactionReference, generateTransactionId } from "../utils";

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const supabase = await createServerSupabaseClient();
    const referenceNumber = generateTransactionReference();

    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaction.senderId,
        account_id: transaction.senderBankId,
        type: 'debit',
        amount: transaction.amount,
        currency: 'ETB',
        description: transaction.name || 'Payment transfer',
        category: 'Transfer',
        status: 'completed',
        recipient_name: transaction.receiverName,
        recipient_account: transaction.receiverBankId,
        recipient_bank: transaction.receiverBankId,
        reference_number: referenceNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }

    return parseStringify(newTransaction);
  } catch (error) {
    console.error('Error in createTransaction:', error);
    return null;
  }
}

// Ethiopian Money Transfer
export const processEthiopianMoneyTransfer = async (params: {
  senderId: string;
  senderBankId: string;
  receiverName: string;
  receiverPhone: string;
  receiverBank: string;
  amount: number;
  description: string;
}) => {
  try {
    const supabase = await createServerSupabaseClient();
    const transactionId = generateTransactionId();

    // Check sender balance and get account details
    const { data: senderAccount, error: balanceError } = await supabase
      .from('bank_accounts')
      .select('balance, account_name, bank_name')
      .eq('id', params.senderBankId)
      .eq('user_id', params.senderId) // Ensure account belongs to sender
      .single();

    if (balanceError || !senderAccount) {
      console.error('Sender account error:', balanceError);
      return { success: false, error: `Sender account not found. Account ID: ${params.senderBankId}` };
    }

    if (senderAccount.balance < params.amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: params.senderId,
        account_id: params.senderBankId,
        transaction_type: 'debit',
        type: 'transfer',
        amount: params.amount,
        currency: 'ETB',
        description: params.description || `Transfer to ${params.receiverName}`,
        category: 'Money Transfer',
        status: 'completed',
        recipient_name: params.receiverName,
        recipient_phone: params.receiverPhone,
        recipient_bank: params.receiverBank,
        sender_account: senderAccount.account_name,
        sender_bank: senderAccount.bank_name,
        reference_number: transactionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return { success: false, error: `Failed to create transaction: ${transactionError.message}` };
    }

    // Update sender balance
    const { error: updateError } = await supabase
      .from('bank_accounts')
      .update({
        balance: senderAccount.balance - params.amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.senderBankId);

    if (updateError) {
      console.error('Balance update error:', updateError);
      return { success: false, error: `Failed to update balance: ${updateError.message}` };
    }

    return { success: true, transaction: parseStringify(transaction) };
  } catch (error) {
    console.error('Ethiopian money transfer error:', error);
    return { success: false, error: 'Transfer failed' };
  }
};

// Ethiopian Bill Payment
export const processEthiopianBillPayment = async (params: {
  senderId: string;
  senderBankId: string;
  billProvider: string;
  billAccount: string;
  amount: number;
  billType: string;
}) => {
  try {
    const supabase = await createServerSupabaseClient();
    const transactionId = generateTransactionId();

    // Check sender balance and get account details
    const { data: senderAccount, error: balanceError } = await supabase
      .from('bank_accounts')
      .select('balance, account_name, bank_name')
      .eq('id', params.senderBankId)
      .eq('user_id', params.senderId) // Ensure account belongs to sender
      .single();

    if (balanceError || !senderAccount) {
      console.error('Sender account error:', balanceError);
      return { success: false, error: `Sender account not found. Account ID: ${params.senderBankId}` };
    }

    if (senderAccount.balance < params.amount) {
      return { success: false, error: `Insufficient balance. Available: ${senderAccount.balance} ETB` };
    }

    // Create bill payment transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: params.senderId,
        account_id: params.senderBankId,
        transaction_type: 'debit',
        type: 'payment',
        amount: params.amount,
        currency: 'ETB',
        description: `Bill payment to ${params.billProvider} - Account: ${params.billAccount}`,
        category: 'Bill Payment',
        status: 'completed',
        recipient_name: params.billProvider,
        recipient_account: params.billAccount,
        bill_type: params.billType,
        sender_account: senderAccount.account_name,
        sender_bank: senderAccount.bank_name,
        reference_number: transactionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Bill payment transaction error:', transactionError);
      return { success: false, error: `Failed to process bill payment: ${transactionError.message}` };
    }

    // Update sender balance
    await supabase
      .from('bank_accounts')
      .update({
        balance: senderAccount.balance - params.amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.senderBankId);

    return { success: true, transaction: parseStringify(transaction) };
  } catch (error) {
    console.error('Bill payment error:', error);
    return { success: false, error: 'Bill payment failed' };
  }
};

// Ethiopian Mobile Money Transfer
export const processEthiopianMobileMoneyTransfer = async (params: {
  senderId: string;
  senderBankId: string;
  recipientPhone: string;
  recipientName: string;
  amount: number;
  mobileProvider: string;
}) => {
  try {
    const supabase = await createServerSupabaseClient();
    const transactionId = generateTransactionId();

    // Check sender balance and get account details
    const { data: senderAccount, error: balanceError } = await supabase
      .from('bank_accounts')
      .select('balance, account_name, bank_name')
      .eq('id', params.senderBankId)
      .eq('user_id', params.senderId) // Ensure account belongs to sender
      .single();

    if (balanceError || !senderAccount) {
      console.error('Sender account error:', balanceError);
      return { success: false, error: `Sender account not found. Account ID: ${params.senderBankId}` };
    }

    if (senderAccount.balance < params.amount) {
      return { success: false, error: `Insufficient balance. Available: ${senderAccount.balance} ETB` };
    }

    // Create mobile money transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: params.senderId,
        account_id: params.senderBankId,
        transaction_type: 'debit',
        type: 'transfer',
        amount: params.amount,
        currency: 'ETB',
        description: `Mobile money transfer to ${params.recipientName} (${params.recipientPhone})`,
        category: 'Mobile Money',
        status: 'completed',
        recipient_name: params.recipientName,
        recipient_phone: params.recipientPhone,
        mobile_provider: params.mobileProvider,
        sender_account: senderAccount.account_name,
        sender_bank: senderAccount.bank_name,
        reference_number: transactionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Mobile money transaction error:', transactionError);
      return { success: false, error: `Failed to process mobile money transfer: ${transactionError.message}` };
    }

    // Update sender balance
    await supabase
      .from('bank_accounts')
      .update({
        balance: senderAccount.balance - params.amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.senderBankId);

    return { success: true, transaction: parseStringify(transaction) };
  } catch (error) {
    console.error('Mobile money transfer error:', error);
    return { success: false, error: 'Mobile money transfer failed' };
  }
};

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', bankId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting transactions by bank ID:', error);
      return { total: 0, documents: [] };
    }

    return parseStringify({
      total: transactions.length,
      documents: transactions,
    });
  } catch (error) {
    console.error('Error in getTransactionsByBankId:', error);
    return { total: 0, documents: [] };
  }
}

// Get all transactions for a user
// QR Payment Processing
export const processQRPayment = async (params: {
  senderId: string;
  senderBankId: string;
  recipientId: string;
  recipientBankId: string;
  amount: number;
  description: string;
  qrData: string;
}) => {
  try {
    const supabase = await createServerSupabaseClient();
    const transactionId = generateTransactionId();

    // Check sender balance
    const { data: senderAccount, error: balanceError } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', params.senderBankId)
      .single();

    if (balanceError || !senderAccount || senderAccount.balance < params.amount) {
      return { success: false, error: 'Insufficient balance or account not found' };
    }

    // Get recipient info
    const { data: recipientAccount, error: recipientError } = await supabase
      .from('bank_accounts')
      .select('account_name, balance')
      .eq('id', params.recipientBankId)
      .single();

    if (recipientError || !recipientAccount) {
      return { success: false, error: 'Recipient account not found' };
    }

    // Create debit transaction for sender
    const { data: debitTransaction, error: debitError } = await supabase
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: params.senderId,
        account_id: params.senderBankId,
        transaction_type: 'debit',
        type: 'payment',
        amount: params.amount,
        currency: 'ETB',
        description: params.description,
        category: 'QR Payment',
        status: 'completed',
        recipient_name: recipientAccount.account_name,
        recipient_account: params.recipientBankId,
        qr_data: params.qrData,
        reference_number: transactionId,
      })
      .select()
      .single();

    if (debitError) {
      return { success: false, error: 'Failed to process QR payment' };
    }

    // Create credit transaction for recipient
    await supabase
      .from('transactions')
      .insert({
        transaction_id: transactionId + '_credit',
        user_id: params.recipientId,
        account_id: params.recipientBankId,
        transaction_type: 'credit',
        type: 'payment',
        amount: params.amount,
        currency: 'ETB',
        description: `QR Payment received: ${params.description}`,
        category: 'QR Payment',
        status: 'completed',
        sender_name: 'QR Payment',
        sender_account: params.senderBankId,
        reference_number: transactionId,
      });

    // Update balances
    await supabase
      .from('bank_accounts')
      .update({
        balance: senderAccount.balance - params.amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.senderBankId);

    await supabase
      .from('bank_accounts')
      .update({
        balance: recipientAccount.balance + params.amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.recipientBankId);

    return { success: true, transaction: parseStringify(debitTransaction) };
  } catch (error) {
    console.error('QR payment error:', error);
    return { success: false, error: 'QR payment failed' };
  }
};

export const getTransactionsByUserId = async ({ userId }: { userId: string }) => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error('Error in getTransactionsByUserId:', error);
    return [];
  }
}