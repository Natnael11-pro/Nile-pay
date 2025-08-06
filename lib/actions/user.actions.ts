'use server';

import { createServerSupabaseClient, supabaseAdmin } from '../supabase';
import { cookies } from 'next/headers';
import { parseStringify, generateEthiopianName, getRandomEthiopianRegion } from '../utils';
import { redirect } from 'next/navigation';

// Sign in user
export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password length validation
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('Sign in error:', error);

      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before signing in.');
      } else if (error.message.includes('Too many requests')) {
        throw new Error('Too many sign-in attempts. Please wait a few minutes and try again.');
      } else {
        throw new Error('Sign in failed. Please try again.');
      }
    }

    // Get user info from our users table
    const user = await getUserInfo({ userId: data.user.id });
    if (!user) {
      throw new Error('User profile not found. Please contact support.');
    }

    return parseStringify(user);
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error; // Re-throw to let the frontend handle the error message
  }
};

// Get user info by ID
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user info:', error);
      return null;
    }

    // Transform to match expected format
    return {
      $id: data.id,
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      national_id: data.national_id,
      date_of_birth: data.date_of_birth,
      city: data.city,
      region: data.region,
      preferredLanguage: data.preferred_language,
      preferred_language: data.preferred_language,
      avatarUrl: data.avatar_url,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      $createdAt: data.created_at,
      $updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    return null;
  }
};

// Sign up user
export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  try {
    // Input validation
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Email, password, first name, and last name are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password validation
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Name validation
    if (firstName.length < 2 || lastName.length < 2) {
      throw new Error('First name and last name must be at least 2 characters long');
    }

    // Phone validation (if provided)
    if (userData.phone) {
      const phoneRegex = /^(\+251|0)?[79]\d{8}$/;
      if (!phoneRegex.test(userData.phone)) {
        throw new Error('Please enter a valid Ethiopian phone number (e.g., +251911234567)');
      }
    }

    // FAN number validation (if provided)
    if (userData.ssn) {
      const fanRegex = /^\d{16}$/;
      if (!fanRegex.test(userData.ssn)) {
        throw new Error('Please enter a valid 16-digit Ethiopian FAN number');
      }
    }

    const supabase = await createServerSupabaseClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);

      // Provide user-friendly error messages
      if (authError.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (authError.message.includes('Password should be at least')) {
        throw new Error('Password must be at least 6 characters long');
      } else if (authError.message.includes('Signup is disabled')) {
        throw new Error('Account creation is temporarily disabled. Please try again later.');
      } else {
        throw new Error('Account creation failed. Please try again.');
      }
    }

    if (!authData.user) {
      throw new Error('Account creation failed. Please try again.');
    }

    // Create user profile in our users table
    const { data: userProfileData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: userData.phone || null,
        city: userData.city || null,
        region: getRandomEthiopianRegion(),
        date_of_birth: userData.dateOfBirth || null,
        national_id: userData.ssn || null, // ssn field maps to national_id
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error('User profile creation error:', userError);

      // Try to clean up the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }

      throw new Error('Failed to create user profile. Please try again.');
    }

    // Create a default bank account for the new user
    try {
      await supabase
        .from('bank_accounts')
        .insert({
          user_id: authData.user.id,
          bank_name: 'Nile Pay Wallet',
          account_name: `${firstName} ${lastName} - Default Wallet`,
          account_number: `NP${Date.now()}${Math.random().toString(36).substr(2, 6)}`,
          account_type: 'savings',
          balance: 50000.00, // Starting balance for demo
          currency: 'ETB',
          is_primary: true,
        });
    } catch (accountError) {
      console.error('Failed to create default bank account:', accountError);
      // Don't fail the signup for this, user can add accounts later
    }

    return parseStringify(userProfileData);
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error; // Re-throw to let the frontend handle the error message
  }
};

// Get logged in user
export async function getLoggedInUser() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error in getLoggedInUser:', error);
      return null;
    }

    if (!user) {
      return null;
    }

    const userInfo = await getUserInfo({ userId: user.id });

    if (!userInfo) {
      console.error('User profile not found for authenticated user:', user.id);
      // Sign out the user if profile is missing
      await supabase.auth.signOut();
      return null;
    }

    return parseStringify(userInfo);
  } catch (error) {
    console.error('Error getting logged in user:', error);
    return null;
  }
}

// Logout user
export const logoutAccount = async () => {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return null;
    }

    redirect('/sign-in');
  } catch (error) {
    console.error('Error logging out:', error);
    return null;
  }
};

// Create demo user with Ethiopian data
export const createDemoUser = async () => {
  try {
    const { firstName, lastName } = generateEthiopianName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nilepay.et`;
    const password = 'demo123456';

    const demoUser = await signUp({
      firstName,
      lastName,
      email,
      password,
      address1: 'Addis Ababa',
      city: 'Addis Ababa',
      state: 'AA',
      postalCode: '1000',
      dateOfBirth: '1990-01-01',
      ssn: '123456789',
      phone: '+251911234567',
    });

    return demoUser;
  } catch (error) {
    console.error('Error creating demo user:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async ({
  userId,
  updates
}: {
  userId: string;
  updates: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    national_id: string;
    date_of_birth: string;
    city: string;
    region: string;
    preferred_language: string;
    avatar_url: string;
  }>
}) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return parseStringify(data);
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
};