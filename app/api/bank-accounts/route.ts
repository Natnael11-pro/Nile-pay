import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - Read all user's bank accounts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's bank accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (accountsError) {
      return NextResponse.json(
        { error: 'Failed to fetch bank accounts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accounts: accounts || []
    });

  } catch (error) {
    console.error('Bank accounts fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new bank account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bank_name, account_name, account_number, account_type, is_primary } = await request.json();

    // Validate required fields
    if (!bank_name || !account_name || !account_number || !account_type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate account number format (Ethiopian bank account numbers are typically 13-16 digits)
    if (!/^[A-Z]{3}\d{9,13}$/.test(account_number)) {
      return NextResponse.json(
        { error: 'Invalid account number format. Should be 3 letters followed by 9-13 digits (e.g., ETH1234567890)' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('bank_accounts')
      .select('id')
      .eq('account_number', account_number)
      .eq('bank_name', bank_name)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'This bank account is already registered' },
        { status: 400 }
      );
    }

    // If this is set as primary, unset other primary accounts
    if (is_primary) {
      await supabase
        .from('bank_accounts')
        .update({ is_primary: false })
        .eq('user_id', user.id);
    }

    // Create new bank account
    const { data: newAccount, error: createError } = await supabase
      .from('bank_accounts')
      .insert({
        user_id: user.id,
        bank_name,
        account_name,
        account_number,
        account_type,
        is_primary: is_primary || false,
        balance: '0.00',
        currency: 'ETB',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Bank account creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create bank account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      account: newAccount,
      message: 'Bank account added successfully'
    });

  } catch (error) {
    console.error('Bank account creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update bank account
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { account_id, account_name, is_primary } = await request.json();

    if (!account_id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Verify account belongs to user
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', account_id)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Bank account not found' },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primary accounts
    if (is_primary) {
      await supabase
        .from('bank_accounts')
        .update({ is_primary: false })
        .eq('user_id', user.id)
        .neq('id', account_id);
    }

    // Update bank account
    const { data: updatedAccount, error: updateError } = await supabase
      .from('bank_accounts')
      .update({
        account_name: account_name || account.account_name,
        is_primary: is_primary !== undefined ? is_primary : account.is_primary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', account_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Bank account update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update bank account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      account: updatedAccount,
      message: 'Bank account updated successfully'
    });

  } catch (error) {
    console.error('Bank account update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
