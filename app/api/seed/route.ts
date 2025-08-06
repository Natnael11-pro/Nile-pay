import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeEthiopianBankingSystem, 
  getEthiopianBankingStats,
  seedEthiopianBanks,
  createDemoUserWithData 
} from '@/lib/actions/seed.actions';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'initialize':
        const result = await initializeEthiopianBankingSystem();
        return NextResponse.json(result);

      case 'seed-banks':
        const bankResult = await seedEthiopianBanks();
        return NextResponse.json(bankResult);

      case 'create-demo-user':
        const userResult = await createDemoUserWithData();
        return NextResponse.json(userResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: initialize, seed-banks, or create-demo-user' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getEthiopianBankingStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
