import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to create client-side Supabase client
export const createClientSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Server-side Supabase client with cookie handling
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          region: string | null
          preferred_language: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          region?: string | null
          preferred_language?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          region?: string | null
          preferred_language?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          bank_id: string
          account_number: string
          account_type: string
          balance: number | null
          available_balance: number | null
          currency: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          bank_id: string
          account_number: string
          account_type: string
          balance?: number | null
          available_balance?: number | null
          currency?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          bank_id?: string
          account_number?: string
          account_type?: string
          balance?: number | null
          available_balance?: number | null
          currency?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          type: string
          amount: number
          currency: string | null
          description: string
          category: string
          status: string | null
          recipient_name: string | null
          recipient_account: string | null
          recipient_bank: string | null
          reference_number: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          type: string
          amount: number
          currency?: string | null
          description: string
          category: string
          status?: string | null
          recipient_name?: string | null
          recipient_account?: string | null
          recipient_bank?: string | null
          reference_number: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          type?: string
          amount?: number
          currency?: string | null
          description?: string
          category?: string
          status?: string | null
          recipient_name?: string | null
          recipient_account?: string | null
          recipient_bank?: string | null
          reference_number?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ethiopian_banks: {
        Row: {
          id: string
          name: string
          code: string
          logo_url: string | null
          color_primary: string
          color_secondary: string
          supports_mobile_money: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          code: string
          logo_url?: string | null
          color_primary: string
          color_secondary: string
          supports_mobile_money?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          code?: string
          logo_url?: string | null
          color_primary?: string
          color_secondary?: string
          supports_mobile_money?: boolean | null
          created_at?: string | null
        }
      }
    }
  }
}
