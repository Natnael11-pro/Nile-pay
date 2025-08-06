'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import { createBrowserClient } from '@supabase/ssr';
import EthiopianSignUpForm from './EthiopianSignUpForm';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: ''
      },
    })

    // Clear error when user starts typing
    const clearError = () => {
      if (error) setError('');
    };
   
    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      setError('');

      try {
        if(type === 'sign-in') {
          // Use client-side Supabase authentication directly
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );

          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email.toLowerCase().trim(),
            password: data.password,
          });

          if (authError) {
            console.error('Sign in error:', authError);

            // Provide user-friendly error messages
            if (authError.message.includes('Invalid login credentials')) {
              throw new Error('Invalid email or password. Please check your credentials and try again.');
            } else if (authError.message.includes('Email not confirmed')) {
              throw new Error('Please check your email and click the confirmation link before signing in.');
            } else if (authError.message.includes('Too many requests')) {
              throw new Error('Too many sign-in attempts. Please wait a few minutes and try again.');
            } else {
              throw new Error('Sign in failed. Please try again.');
            }
          }

          if (authData.user) {
            // Successful sign in - force a full page reload to update server-side session
            window.location.href = '/';
          } else {
            throw new Error('Sign in failed. Please try again.');
          }
        }
      } catch (error: any) {
        console.error('Sign in error:', error);
        setError(error.message || 'Sign in failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

  // If it's sign-up, render the Ethiopian sign-up form
  if (type === 'sign-up') {
    return (
      <section className="auth-form eth-pattern-subtle">
        <header className='flex flex-col gap-5 md:gap-8 eth-animate-fade-in-up mb-8'>
          <Link href="/" className="cursor-pointer flex items-center gap-2 group justify-center">
            <div className="relative">
              <Image
                src="/icons/nile-pay-logo.svg"
                width={40}
                height={40}
                alt="Nile Pay logo"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-28 font-ibm-plex-serif font-bold eth-gradient-text">
              Nile Pay
            </h1>
            <span className="text-xs bg-gradient-to-r from-green-600 to-emerald-500 text-white px-2 py-1 rounded-full font-medium">
              🇪🇹 ET
            </span>
          </Link>
        </header>

        <EthiopianSignUpForm />

        <footer className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <p className="text-14 font-normal text-gray-600">
              Already have a Nile Pay account?
            </p>
            <Link
              href="/sign-in"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 relative group"
            >
              Sign In
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Ethiopian Cultural Footer */}
          <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4 w-full justify-center">
            <span>Powered by Ethiopian innovation</span>
            <span className="text-green-500">🇪🇹</span>
            <span>•</span>
            <span>Built for Africa</span>
            <span className="text-yellow-500">🌍</span>
          </div>
        </footer>
      </section>
    );
  }

  return (
    <section className="auth-form eth-pattern-subtle">
      <header className='flex flex-col gap-5 md:gap-8 eth-animate-fade-in-up'>
          <Link href="/" className="cursor-pointer flex items-center gap-2 group">
            <div className="relative">
              <Image
                src="/icons/nile-pay-logo.svg"
                width={40}
                height={40}
                alt="Nile Pay logo"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-28 font-ibm-plex-serif font-bold eth-gradient-text">
              Nile Pay
            </h1>
            <span className="text-xs bg-gradient-to-r from-green-600 to-emerald-500 text-white px-2 py-1 rounded-full font-medium">
              🇪🇹 ET
            </span>
          </Link>

          <div className="flex flex-col gap-2 md:gap-4 eth-animate-slide-in-right">
            <h1 className="text-28 lg:text-40 font-bold text-gray-900 leading-tight">
              {type === 'sign-in' ? (
                <>
                  Welcome Back to <span className="eth-gradient-text">Nile Pay</span>
                </>
              ) : (
                <>
                  Join <span className="eth-gradient-text">Nile Pay</span> Today
                </>
              )}
            </h1>
            <p className="text-16 lg:text-18 font-medium text-gray-600 leading-relaxed">
              {type === 'sign-in'
                ? '🇪🇹 Access your Ethiopian digital payment account'
                : '🚀 Create your Ethiopian digital payment account and start sending money across Ethiopia'
              }
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Trusted by thousands of Ethiopians
            </div>
          </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <span className="font-medium">Sign In Failed</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' />
                  </div>
                  <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city (e.g., Addis Ababa)' />
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='region' label="Region" placeholder='Select your region' />
                    <CustomInput control={form.control} name='phone' label="Phone Number" placeholder='+251912345678' />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
                    <CustomInput control={form.control} name='nationalId' label="FAN Number (Ethiopian National ID)" placeholder='1234567890123456' />
                  </div>
                </>
              )}

              <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' onChange={clearError} />

              <div className="space-y-2">
                <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' onChange={clearError} />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700 transition-colors duration-200 font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="eth-btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {type === 'sign-in' ? (
                        <>
                          <span className="mr-2">🔐</span>
                          Login
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🚀</span>
                          Create Nile Pay Account
                        </>
                      )}
                    </>
                  )}
                </Button>

                {/* Ethiopian Trust Indicators */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">🔒</span>
                    Bank-level security
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⚡</span>
                    Instant transfers
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500">🇪🇹</span>
                    Made for Ethiopia
                  </div>
                </div>
              </div>
            </form>
          </Form>

          <footer className="flex flex-col items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <p className="text-14 font-normal text-gray-600">
                {type === 'sign-in'
                ? "New to Nile Pay?"
                : "Already have a Nile Pay account?"}
              </p>
              <Link
                href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 relative group"
              >
                {type === 'sign-in' ? 'Create Account' : 'Sign In'}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Public Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mb-4">
              <Link href="/about" className="hover:text-green-600 transition-colors">
                About Nile Pay
              </Link>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-green-600 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-green-600 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-green-600 transition-colors">
                Contact Us
              </Link>
            </div>

            {/* Ethiopian Cultural Footer */}
            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4 w-full justify-center">
              <span>Powered by Ethiopian innovation</span>
              <span className="text-green-500">🇪🇹</span>
              <span>•</span>
              <span>Built for Africa</span>
              <span className="text-yellow-500">🌍</span>
            </div>
          </footer>
    </section>
  )
}

export default AuthForm