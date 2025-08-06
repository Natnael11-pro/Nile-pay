import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Look up user by email in the users table
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate display name from email if names are not available
    const generateNameFromEmail = (email: string) => {
      const localPart = email.split('@')[0];
      const parts = localPart.split(/[._-]/);
      return parts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
    };

    const firstName = user.first_name || generateNameFromEmail(email).split(' ')[0] || 'User';
    const lastName = user.last_name || generateNameFromEmail(email).split(' ').slice(1).join(' ') || '';

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      memberSince: new Date(user.created_at).getFullYear(),
    });

  } catch (error) {
    console.error('User lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
