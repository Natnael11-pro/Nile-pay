'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomInput from './CustomInput';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };

    handleAuthCallback();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="auth-form eth-pattern-subtle">
        <header className='flex flex-col gap-5 md:gap-8 eth-animate-fade-in-up'>
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

        <div className="w-full max-w-md mx-auto text-center eth-animate-slide-in-right">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful! ✅
            </h2>
            <p className="text-gray-600">
              Your password has been updated successfully. You'll be redirected to sign in shortly.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">🔒</span>
              <div>
                <p className="font-semibold text-green-800 mb-1">Security Notice</p>
                <p>
                  Your account is now secure with your new password. Please sign in to access your Nile Pay account.
                </p>
              </div>
            </div>
          </div>

          <Link href="/sign-in">
            <Button className="eth-btn-primary w-full">
              Continue to Sign In
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-form eth-pattern-subtle">
      <header className='flex flex-col gap-5 md:gap-8 eth-animate-fade-in-up'>
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

        <div className="flex flex-col gap-2 md:gap-4 eth-animate-slide-in-right">
          <h1 className="text-28 lg:text-40 font-bold text-gray-900 leading-tight">
            Reset Your Password 🔐
          </h1>
          <p className="text-16 lg:text-18 font-medium text-gray-600 leading-relaxed">
            Enter your new password below to secure your Nile Pay account.
          </p>
        </div>
      </header>

      <div className="w-full max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-red-800 mb-1">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput 
              control={form.control} 
              name='password' 
              label="New Password" 
              placeholder='Enter your new password (min. 8 characters)' 
            />

            <CustomInput 
              control={form.control} 
              name='confirmPassword' 
              label="Confirm New Password" 
              placeholder='Confirm your new password' 
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="eth-btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Update Password
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/sign-in" 
                className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 relative group"
              >
                Back to Sign In
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </form>
        </Form>
      </div>

      <footer className="flex flex-col items-center gap-4 mt-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-4 w-full justify-center">
          <span>Secure password reset</span>
          <span className="text-green-500">🔒</span>
          <span>•</span>
          <span>Ethiopian banking security</span>
          <span className="text-yellow-500">🇪🇹</span>
        </div>
      </footer>
    </section>
  );
};

export default ResetPasswordForm;
