'use server';

import { supabaseAdmin } from '../supabase';
import { ethiopianBanks } from '../utils';
import { 
  generateEthiopianUser, 
  generateEthiopianBankAccount, 
  generateAccountTransactions 
} from '../data/ethiopian-data';
import { parseStringify } from '../utils';

// Seed Ethiopian banks into the database
export const seedEthiopianBanks = async () => {
  try {
    console.log('Seeding Ethiopian banks...');
    
    for (const bank of ethiopianBanks) {
      const { data, error } = await supabaseAdmin
        .from('ethiopian_banks')
        .upsert({
          name: bank.name,
          code: bank.code,
          color_primary: bank.color,
          color_secondary: bank.color,
          supports_mobile_money: true,
          logo_url: `/icons/banks/${bank.code.toLowerCase()}.svg`,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'code'
        });

      if (error) {
        console.error(`Error seeding bank ${bank.name}:`, error);
      } else {
        console.log(`✅ Seeded bank: ${bank.name}`);
      }
    }

    console.log('✅ Ethiopian banks seeding completed');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Ethiopian banks:', error);
    return { success: false, error };
  }
};

// Create demo user with Ethiopian data
export const createDemoUserWithData = async () => {
  try {
    console.log('Creating demo user with Ethiopian data...');
    
    // Generate user data
    const userData = generateEthiopianUser();
    
    // Create auth user first
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: 'demo123456',
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return null;
    }

    // Create user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        ...userData,
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user profile:', userError);
      return null;
    }

    console.log(`✅ Created demo user: ${user.first_name} ${user.last_name}`);

    // Create 2-3 bank accounts for the user
    const accountCount = Math.floor(Math.random() * 2) + 2; // 2-3 accounts
    const accounts = [];

    for (let i = 0; i < accountCount; i++) {
      const accountData = generateEthiopianBankAccount(user.id);
      
      // Get the bank ID
      const { data: bank } = await supabaseAdmin
        .from('ethiopian_banks')
        .select('id')
        .eq('code', accountData.bank_code)
        .single();

      if (bank) {
        const { data: account, error: accountError } = await supabaseAdmin
          .from('accounts')
          .insert({
            user_id: user.id,
            bank_id: bank.id,
            account_number: accountData.account_number,
            account_type: accountData.account_type,
            balance: accountData.balance,
            available_balance: accountData.available_balance,
            currency: accountData.currency,
            is_active: accountData.is_active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (accountError) {
          console.error('Error creating account:', accountError);
        } else {
          accounts.push(account);
          console.log(`✅ Created account: ${accountData.bank_name} - ${accountData.account_type}`);

          // Generate transactions for this account
          const transactions = generateAccountTransactions(user.id, account.id, 15);
          
          for (const transaction of transactions) {
            const { error: transError } = await supabaseAdmin
              .from('transactions')
              .insert(transaction);

            if (transError) {
              console.error('Error creating transaction:', transError);
            }
          }
          
          console.log(`✅ Created ${transactions.length} transactions for account`);
        }
      }
    }

    return parseStringify({
      user,
      accounts,
      message: `Demo user created with ${accounts.length} accounts and transactions`
    });
  } catch (error) {
    console.error('Error creating demo user with data:', error);
    return null;
  }
};

// Seed multiple demo users
export const seedDemoUsers = async (count: number = 5) => {
  try {
    console.log(`Creating ${count} demo users...`);
    
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = await createDemoUserWithData();
      if (user) {
        users.push(user);
      }
    }

    console.log(`✅ Created ${users.length} demo users with accounts and transactions`);
    return parseStringify(users);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    return null;
  }
};

// Initialize the entire Ethiopian banking system
export const initializeEthiopianBankingSystem = async () => {
  try {
    console.log('🇪🇹 Initializing Ethiopian Banking System for Nile Pay...');
    
    // Step 1: Seed Ethiopian banks
    await seedEthiopianBanks();
    
    // Step 2: Create demo users with accounts and transactions
    await seedDemoUsers(3);
    
    console.log('🎉 Ethiopian Banking System initialization completed!');
    return { success: true, message: 'Ethiopian Banking System initialized successfully' };
  } catch (error) {
    console.error('Error initializing Ethiopian Banking System:', error);
    return { success: false, error };
  }
};

// Get Ethiopian banking statistics
export const getEthiopianBankingStats = async () => {
  try {
    // Get total users
    const { count: userCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total accounts
    const { count: accountCount } = await supabaseAdmin
      .from('accounts')
      .select('*', { count: 'exact', head: true });

    // Get total transactions
    const { count: transactionCount } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get total balance across all accounts
    const { data: balanceData } = await supabaseAdmin
      .from('accounts')
      .select('balance')
      .eq('is_active', true);

    const totalBalance = balanceData?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0;

    // Get bank distribution
    const { data: bankStats } = await supabaseAdmin
      .from('accounts')
      .select(`
        ethiopian_banks (name, code),
        balance
      `)
      .eq('is_active', true);

    return parseStringify({
      userCount: userCount || 0,
      accountCount: accountCount || 0,
      transactionCount: transactionCount || 0,
      totalBalance,
      bankStats: bankStats || [],
    });
  } catch (error) {
    console.error('Error getting Ethiopian banking stats:', error);
    return null;
  }
};
