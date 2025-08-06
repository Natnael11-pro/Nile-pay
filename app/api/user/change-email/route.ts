import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { newEmail, otpVerified } = await request.json();

    if (!newEmail || !otpVerified) {
      return NextResponse.json(
        { error: 'Email and OTP verification are required' },
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

    // Get user data from our users table (OTP already verified)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if new email is already in use
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', newEmail.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email address is already in use' },
        { status: 400 }
      );
    }

    // Check if new email is already in use in auth.users
    // Note: We'll rely on Supabase Auth to handle duplicate email validation
    // during the updateUser call

    // Update email in Supabase Auth (this will send a confirmation email)
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update email. Please try again.' },
        { status: 500 }
      );
    }

    // Note: We don't update the users table here because Supabase Auth
    // will handle the email confirmation process. The email will be updated
    // in the auth.users table only after confirmation.

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent. Please check your new email address.'
    });

  } catch (error) {
    console.error('Email change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
