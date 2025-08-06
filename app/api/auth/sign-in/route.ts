import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for sign-in
const signInSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(255, 'Email is too long'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = signInSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: errors,
          message: errors[0] // Return first error as main message
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (authError) {
      console.error('Authentication error:', authError);

      // Provide user-friendly error messages
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Too many sign-in attempts. Please wait a few minutes and try again.';
      } else if (authError.message.includes('User not found')) {
        errorMessage = 'No account found with this email address. Please sign up first.';
      } else if (authError.message.includes('Invalid password')) {
        errorMessage = 'Incorrect password. Please try again.';
      }

      return NextResponse.json(
        { 
          error: 'Authentication failed',
          message: errorMessage,
          code: authError.message.includes('Invalid login credentials') ? 'INVALID_CREDENTIALS' : 'AUTH_ERROR'
        },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          message: 'Sign in failed. Please try again.'
        },
        { status: 401 }
      );
    }

    // Get user profile from our users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError);
      
      // Sign out the user since profile is missing
      await supabase.auth.signOut();
      
      return NextResponse.json(
        { 
          error: 'Profile not found',
          message: 'User profile not found. Please contact support or try signing up again.'
        },
        { status: 404 }
      );
    }

    // Transform user data to expected format
    const userData = {
      $id: userProfile.id,
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.first_name,
      lastName: userProfile.last_name,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      phone: userProfile.phone,
      national_id: userProfile.national_id,
      date_of_birth: userProfile.date_of_birth,
      city: userProfile.city,
      region: userProfile.region,
      preferredLanguage: userProfile.preferred_language,
      preferred_language: userProfile.preferred_language,
      avatarUrl: userProfile.avatar_url,
      avatar_url: userProfile.avatar_url,
      created_at: userProfile.created_at,
      $createdAt: userProfile.created_at,
      $updatedAt: userProfile.updated_at,
      isAdmin: userProfile.is_admin || false,
      emailConfirmed: userProfile.email_confirmed || false,
    };

    // Create response with success data
    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful',
      user: userData,
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at,
      }
    });

    // Set authentication cookies manually to ensure server-side session works
    if (authData.session) {
      const maxAge = 60 * 60 * 24 * 7; // 7 days

      response.cookies.set('sb-access-token', authData.session.access_token, {
        maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
        maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Sign in API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}

// GET method to check authentication status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Not authenticated'
        },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'User profile not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        $id: userProfile.id,
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        phone: userProfile.phone,
        national_id: userProfile.national_id,
        date_of_birth: userProfile.date_of_birth,
        city: userProfile.city,
        region: userProfile.region,
        preferredLanguage: userProfile.preferred_language,
        preferred_language: userProfile.preferred_language,
        avatarUrl: userProfile.avatar_url,
        avatar_url: userProfile.avatar_url,
        created_at: userProfile.created_at,
        $createdAt: userProfile.created_at,
        $updatedAt: userProfile.updated_at,
        isAdmin: userProfile.is_admin || false,
        emailConfirmed: userProfile.email_confirmed || false,
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Authentication check failed'
      },
      { status: 500 }
    );
  }
}
