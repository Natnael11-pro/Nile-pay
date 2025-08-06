'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CustomInput from './CustomInput';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Error sending reset email:', error);
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
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
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email 📧
            </h2>
            <p className="text-gray-600">
              We've sent a password reset link to <strong>{form.getValues('email')}</strong>
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">💡</span>
              <div>
                <p className="font-semibold text-green-800 mb-1">Next Steps</p>
                <p>
                  Click the link in your email to reset your password. The link will expire in 1 hour for security.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setIsEmailSent(false)}
              className="eth-btn-secondary w-full"
            >
              Try Different Email
            </Button>
            
            <Link href="/sign-in" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
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
            Forgot Your Password? 🔐
          </h1>
          <p className="text-16 lg:text-18 font-medium text-gray-600 leading-relaxed">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </header>

      <div className="w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput 
              control={form.control} 
              name='email' 
              label="Email Address" 
              placeholder='Enter your Nile Pay email address' 
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
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/sign-in" 
                className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200 relative group inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
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

export default ForgotPasswordForm;
