import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getTransactionsByUserId } from '@/lib/actions/transaction.actions';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Starting home data check...');
    
    // Step 1: Check logged in user
    console.log('🔍 Debug: Getting logged in user...');
    const loggedIn = await getLoggedInUser();
    console.log('🔍 Debug: Logged in user:', loggedIn ? 'Found' : 'Not found');
    
    if (!loggedIn) {
      return NextResponse.json({
        success: false,
        error: 'No logged in user',
        step: 'getLoggedInUser'
      });
    }

    // Step 2: Check accounts
    console.log('🔍 Debug: Getting accounts for user:', loggedIn.id);
    const accounts = await getAccounts(loggedIn.id);
    console.log('🔍 Debug: Accounts found:', accounts?.length || 0);
    console.log('🔍 Debug: Accounts data:', accounts);

    // Step 3: Check transactions
    console.log('🔍 Debug: Getting transactions for user:', loggedIn.$id || loggedIn.id);
    const transactions = await getTransactionsByUserId({ userId: loggedIn.$id || loggedIn.id });
    console.log('🔍 Debug: Transactions found:', transactions?.length || 0);

    // Step 4: Test balance calculation
    let totalBalance = 0;
    let balanceError = null;
    try {
      totalBalance = accounts?.reduce((total, acc) => {
        const balance = typeof acc.balance === 'string' ? parseFloat(acc.balance) : acc.balance || 0;
        console.log('🔍 Debug: Account balance:', acc.account_name, balance);
        return total + balance;
      }, 0) || 0;
      console.log('🔍 Debug: Total balance calculated:', totalBalance);
    } catch (error) {
      balanceError = error;
      console.error('🔍 Debug: Balance calculation error:', error);
    }

    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: loggedIn.id,
          email: loggedIn.email,
          firstName: loggedIn.firstName,
          lastName: loggedIn.lastName
        },
        accounts: {
          count: accounts?.length || 0,
          data: accounts?.map(acc => ({
            id: acc.id,
            bank_name: acc.bank_name,
            account_name: acc.account_name,
            balance: acc.balance,
            balance_type: typeof acc.balance
          })) || []
        },
        transactions: {
          count: transactions?.length || 0,
          sample: transactions?.slice(0, 2) || []
        },
        totalBalance,
        balanceError: balanceError instanceof Error ? balanceError.message : null
      }
    });

  } catch (error) {
    console.error('🔍 Debug: Home data error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}
