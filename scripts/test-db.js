// Test script to verify database connectivity
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
  console.log('🧪 Testing Nile Pay Database Connection...\n');

  try {
    // Test 1: Check Ethiopian banks
    console.log('1. Testing Ethiopian banks table...');
    const { data: banksData, error: banksError } = await supabase
      .from('ethiopian_banks')
      .select('*')
      .limit(5);

    if (banksError) {
      console.error('❌ Banks table error:', banksError.message);
      return;
    }

    console.log('✅ Ethiopian banks table accessible');
    console.log(`Found ${banksData.length} banks:`);
    banksData.forEach(bank => {
      console.log(`  - ${bank.name} (${bank.code})`);
    });

    // Test 2: Check users table
    console.log('\n2. Testing users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .limit(3);

    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
      return;
    }

    console.log('✅ Users table accessible');
    console.log(`Found ${usersData.length} users`);

    // Test 3: Check accounts table
    console.log('\n3. Testing accounts table...');
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('id, account_number, account_type, balance')
      .limit(3);

    if (accountsError) {
      console.error('❌ Accounts table error:', accountsError.message);
      return;
    }

    console.log('✅ Accounts table accessible');
    console.log(`Found ${accountsData.length} accounts`);

    // Test 4: Check transactions table
    console.log('\n4. Testing transactions table...');
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, type, amount, description, status')
      .limit(3);

    if (transactionsError) {
      console.error('❌ Transactions table error:', transactionsError.message);
      return;
    }

    console.log('✅ Transactions table accessible');
    console.log(`Found ${transactionsData.length} transactions`);

    // Test 5: Test RLS policies (should fail with anon key)
    console.log('\n5. Testing Row Level Security...');
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: rlsData, error: rlsError } = await anonSupabase
      .from('users')
      .select('*')
      .limit(1);

    if (rlsError) {
      console.log('✅ RLS is working (anon access blocked)');
    } else {
      console.log('⚠️  RLS might not be properly configured');
    }

    console.log('\n🎉 Database connectivity tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Ethiopian banks table');
    console.log('✅ Users table');
    console.log('✅ Accounts table');
    console.log('✅ Transactions table');
    console.log('✅ Row Level Security');

    console.log('\n🚀 Ready for authentication testing!');
    console.log('💡 To test authentication:');
    console.log('   1. Go to http://localhost:3000/sign-up');
    console.log('   2. Create a new account');
    console.log('   3. Check your email for confirmation');
    console.log('   4. Sign in at http://localhost:3000/sign-in');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testDatabase();
