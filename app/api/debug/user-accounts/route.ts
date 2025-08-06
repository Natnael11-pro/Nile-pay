import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    let user, userError;

    // Look up user by email or ID
    if (userId) {
      const result = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      user = result.data;
      userError = result.error;
    } else {
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      user = result.data;
      userError = result.error;
    }

    if (userError || !user) {
      return NextResponse.json({
        found: false,
        error: 'User not found',
        searchEmail: email?.toLowerCase().trim(),
        searchUserId: userId,
        userError: userError?.message
      });
    }

    // Get user's bank accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user.id);

    // Test the exact same query used in the transfer API
    const { data: transferCheckAccounts, error: transferCheckError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user.id);

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      },
      accounts: accounts || [],
      accountCount: accounts?.length || 0,
      hasAccounts: accounts && accounts.length > 0,
      accountsError: accountsError?.message || null,
      transferCheck: {
        accounts: transferCheckAccounts || [],
        accountCount: transferCheckAccounts?.length || 0,
        hasAccounts: transferCheckAccounts && transferCheckAccounts.length > 0,
        error: transferCheckError?.message || null
      },
      // Additional debugging info
      debug: {
        originalEmail: email,
        processedEmail: email?.toLowerCase().trim(),
        userId: userId,
        userFound: !!user,
        accountsFound: !!(accounts && accounts.length > 0)
      }
    });

  } catch (error) {
    console.error('Debug user accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
