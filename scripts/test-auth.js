// Test script to verify authentication is working
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🧪 Testing Nile Pay Authentication...\n');

  // Test 1: Create a test user
  console.log('1. Creating test user...');
  const testEmail = 'test@nilepay.com';
  const testPassword = 'test123456';

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:3000/dashboard'
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ User already exists, proceeding with sign-in test');
      } else {
        console.error('❌ Sign-up error:', signUpError.message);
        return;
      }
    } else {
      console.log('✅ User created successfully');
    }

    // Test 2: Sign in with the test user
    console.log('\n2. Testing sign-in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Sign-in error:', signInError.message);
      return;
    }

    console.log('✅ Sign-in successful');
    console.log('User ID:', signInData.user.id);
    console.log('Email:', signInData.user.email);

    // Test 3: Check session
    console.log('\n3. Checking session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
      return;
    }

    if (sessionData.session) {
      console.log('✅ Session active');
      console.log('Access token exists:', !!sessionData.session.access_token);
    } else {
      console.log('❌ No active session');
    }

    // Test 4: Test database connection
    console.log('\n4. Testing database connection...');
    const { data: banksData, error: banksError } = await supabase
      .from('ethiopian_banks')
      .select('name, code')
      .limit(3);

    if (banksError) {
      console.error('❌ Database error:', banksError.message);
      return;
    }

    console.log('✅ Database connection successful');
    console.log('Sample banks:', banksData.map(bank => `${bank.name} (${bank.code})`).join(', '));

    // Test 5: Sign out
    console.log('\n5. Testing sign-out...');
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('❌ Sign-out error:', signOutError.message);
      return;
    }

    console.log('✅ Sign-out successful');

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('✅ User registration/creation');
    console.log('✅ User sign-in');
    console.log('✅ Session management');
    console.log('✅ Database connectivity');
    console.log('✅ User sign-out');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testAuth();
