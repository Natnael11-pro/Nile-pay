import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - Read user profile
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

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
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

    const updates = await request.json();

    // Validate required fields
    if (updates.first_name && updates.first_name.length < 2) {
      return NextResponse.json(
        { error: 'First name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (updates.last_name && updates.last_name.length < 2) {
      return NextResponse.json(
        { error: 'Last name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Validate phone number if provided
    if (updates.phone && !/^(\+251|0)?[79]\d{8}$/.test(updates.phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Ethiopian phone number' },
        { status: 400 }
      );
    }

    // Validate FAN number if provided
    if (updates.national_id && !/^\d{16}$/.test(updates.national_id)) {
      return NextResponse.json(
        { error: 'FAN number must be exactly 16 digits' },
        { status: 400 }
      );
    }

    // Update user profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account (soft delete)
export async function DELETE(request: NextRequest) {
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

    // Check if user has any bank accounts with balance
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('balance, account_name, bank_name')
      .eq('user_id', user.id);

    if (accountsError) {
      return NextResponse.json(
        { error: 'Failed to check account status' },
        { status: 500 }
      );
    }

    // Check if user has any balance
    const totalBalance = accounts?.reduce((sum, account) => sum + parseFloat(account.balance), 0) || 0;

    if (totalBalance > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete account with remaining balance. Please withdraw all funds first.',
          balance: totalBalance,
          accounts: accounts?.filter(acc => parseFloat(acc.balance) > 0).map(acc => ({
            name: acc.account_name,
            bank: acc.bank_name,
            balance: acc.balance
          }))
        },
        { status: 400 }
      );
    }

    // Delete all user's bank accounts first
    if (accounts && accounts.length > 0) {
      const { error: deleteBankAccountsError } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('user_id', user.id);

      if (deleteBankAccountsError) {
        console.error('Error deleting bank accounts:', deleteBankAccountsError);
        return NextResponse.json(
          { error: 'Failed to disconnect bank accounts' },
          { status: 500 }
        );
      }
    }

    // Soft delete - mark as deleted instead of actually deleting
    const { error: deleteError } = await supabase
      .from('users')
      .update({
        email: `deleted_${Date.now()}_${user.email}`,
        first_name: 'Deleted',
        last_name: 'User',
        phone: null,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (deleteError) {
      console.error('Account deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
