import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - Read specific bank account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the specific bank account
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: 'Bank account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      account
    });

  } catch (error) {
    console.error('Bank account fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update specific bank account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { account_name, is_primary } = await request.json();

    // Verify account belongs to user
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', id)
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
        .neq('id', id);
    }

    // Update bank account
    const { data: updatedAccount, error: updateError } = await supabase
      .from('bank_accounts')
      .update({
        account_name: account_name || account.account_name,
        is_primary: is_primary !== undefined ? is_primary : account.is_primary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the account exists and belongs to the user
    const { data: account, error: fetchError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !account) {
      return NextResponse.json(
        { error: 'Account not found or access denied' },
        { status: 404 }
      );
    }

    // Get all user accounts to check if this is the primary account
    const { data: userAccounts, error: countError } = await supabase
      .from('bank_accounts')
      .select('id, is_primary')
      .eq('user_id', user.id);

    if (countError) {
      return NextResponse.json(
        { error: 'Failed to check account count' },
        { status: 500 }
      );
    }

    // Users can now disconnect their last bank account
    // This allows them to delete their profile if needed

    // Note: Account can be disconnected even with balance
    // Users are warned about this in the UI

    // Check for pending transactions
    const { data: pendingTransactions, error: transactionError } = await supabase
      .from('transactions')
      .select('id')
      .eq('account_id', id)
      .eq('status', 'pending');

    if (transactionError) {
      return NextResponse.json(
        { error: 'Failed to check pending transactions' },
        { status: 500 }
      );
    }

    if (pendingTransactions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete account with pending transactions' },
        { status: 400 }
      );
    }

    // If this is the primary account, make another account primary
    if (account.is_primary && userAccounts.length > 1) {
      const { error: updatePrimaryError } = await supabase
        .from('bank_accounts')
        .update({ is_primary: true })
        .eq('user_id', user.id)
        .neq('id', id)
        .limit(1);

      if (updatePrimaryError) {
        return NextResponse.json(
          { error: 'Failed to update primary account' },
          { status: 500 }
        );
      }
    }

    // Delete the account
    const { error: deleteError } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bank account disconnected successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
