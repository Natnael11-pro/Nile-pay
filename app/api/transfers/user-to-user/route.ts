import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const {
      senderId,
      receiverId,
      senderBankId,
      amount,
      description,
      otpVerified,
      receiverEmail
    } = await request.json();

    // Validate required fields
    if (!senderId || !receiverId || !senderBankId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount <= 0 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot transfer to yourself' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get sender user info
    const { data: senderUser, error: senderError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', senderId)
      .single();

    if (senderError || !senderUser) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Get sender's account
    const { data: senderAccount, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', senderBankId)
      .eq('user_id', senderId)
      .single();

    if (accountError || !senderAccount) {
      return NextResponse.json(
        { error: 'Sender account not found' },
        { status: 404 }
      );
    }

    // Check sufficient balance
    if (senderAccount.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Verify receiver exists
    const { data: receiverUser, error: receiverError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiverUser) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Check if receiver has any bank account using raw SQL to bypass RLS
    const { data: receiverAccountsCheck, error: receiverAccountError } = await supabase
      .rpc('check_user_bank_accounts', { user_id_param: receiverId });

    if (receiverAccountError) {
      console.error('Receiver account check error:', receiverAccountError);
      return NextResponse.json(
        { error: 'Failed to check receiver account status' },
        { status: 500 }
      );
    }

    if (!receiverAccountsCheck || receiverAccountsCheck.length === 0) {
      return NextResponse.json(
        {
          error: 'RECIPIENT_NO_ACCOUNT',
          message: `${receiverUser.first_name} ${receiverUser.last_name} doesn't have a bank account linked to their Nile Pay account. They need to add a bank account before they can receive money.`,
          recipientName: `${receiverUser.first_name} ${receiverUser.last_name}`,
          recipientEmail: receiverUser.email
        },
        { status: 400 }
      );
    }

    // Get receiver accounts for the actual transfer
    const { data: receiverAccounts, error: receiverAccountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', receiverId);

    if (receiverAccountsError || !receiverAccounts || receiverAccounts.length === 0) {
      return NextResponse.json(
        {
          error: 'RECIPIENT_NO_ACCOUNT',
          message: `${receiverUser.first_name} ${receiverUser.last_name} doesn't have a bank account linked to their Nile Pay account. They need to add a bank account before they can receive money.`,
          recipientName: `${receiverUser.first_name} ${receiverUser.last_name}`,
          recipientEmail: receiverUser.email
        },
        { status: 400 }
      );
    }

    // Get receiver's primary account or first available account
    let receiverAccount = receiverAccounts.find(acc => acc.is_primary) || receiverAccounts[0];

    // Start transaction
    const transferId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update sender's balance
    const { error: senderUpdateError } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: senderAccount.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', senderBankId);

    if (senderUpdateError) {
      return NextResponse.json(
        { error: 'Failed to update sender balance' },
        { status: 500 }
      );
    }

    // Update receiver's balance
    const { error: receiverUpdateError } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: receiverAccount.balance + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', receiverAccount.id);

    if (receiverUpdateError) {
      // Rollback sender's balance
      await supabase
        .from('bank_accounts')
        .update({ balance: senderAccount.balance })
        .eq('id', senderBankId);

      return NextResponse.json(
        { error: 'Failed to update receiver balance' },
        { status: 500 }
      );
    }

    // Create transaction records
    const transactionData = {
      transaction_id: transferId,
      amount,
      description: description || 'User to user transfer',
      type: 'transfer',
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Sender transaction (debit)
    await supabase
      .from('transactions')
      .insert({
        ...transactionData,
        user_id: senderId,
        account_id: senderBankId,
        transaction_type: 'debit',
        category: 'User Transfer',
        recipient_email: receiverUser.email,
        recipient_name: `${receiverUser.first_name || ''} ${receiverUser.last_name || ''}`.trim() || receiverUser.email,
        sender_account: senderAccount.account_name,
        sender_bank: senderAccount.bank_name,
        reference_number: transferId,
      });

    // Receiver transaction (credit)
    await supabase
      .from('transactions')
      .insert({
        ...transactionData,
        user_id: receiverId,
        account_id: receiverAccount.id,
        transaction_type: 'credit',
        category: 'User Transfer',
        sender_email: senderUser.email,
        sender_name: 'Nile Pay User',
        sender_account: receiverAccount.account_name,
        sender_bank: receiverAccount.bank_name,
        reference_number: transferId,
      });

    return NextResponse.json({
      success: true,
      transferId,
      message: 'Transfer completed successfully',
      details: {
        amount,
        recipient: `${receiverUser.first_name || ''} ${receiverUser.last_name || ''}`.trim() || receiverUser.email,
        description,
      }
    });

  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
