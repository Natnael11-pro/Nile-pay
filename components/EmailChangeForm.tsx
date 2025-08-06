'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertCircle, Mail, Lock, CheckCircle } from 'lucide-react';


const emailChangeSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  confirmEmail: z.string().email('Please enter a valid email address'),
}).refine((data) => data.newEmail === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"],
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  user: any;
}

const EmailChangeForm = ({ user }: EmailChangeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
  });

  const onSubmit = async (data: EmailChangeFormData) => {
    if (data.newEmail === user.email) {
      setMessage('❌ New email must be different from current email');
      return;
    }

    setIsLoading(true);

    try {
      // Change email directly without OTP verification
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail: data.newEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowEmailSent(true);
        reset();
        setMessage('✅ Email changed successfully! Please sign in with your new email.');
      } else {
        throw new Error(result.error || 'Failed to change email');
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Change Email Address
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Update your email address. You'll need to confirm the new email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                : 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Current Email Display */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Email</Label>
            <p className="text-gray-900 dark:text-gray-100 font-medium">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Email */}
            <div className="space-y-2">
              <Label htmlFor="newEmail" className="text-sm font-medium">
                New Email Address *
              </Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter your new email address"
                {...register('newEmail')}
                className="border-gray-300 focus:border-green-500"
              />
              {errors.newEmail && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.newEmail.message}
                </p>
              )}
            </div>

            {/* Confirm Email */}
            <div className="space-y-2">
              <Label htmlFor="confirmEmail" className="text-sm font-medium">
                Confirm New Email Address *
              </Label>
              <Input
                id="confirmEmail"
                type="email"
                placeholder="Confirm your new email address"
                {...register('confirmEmail')}
                className="border-gray-300 focus:border-green-500"
              />
              {errors.confirmEmail && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmEmail.message}
                </p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Security Notice</p>
                  <ul className="space-y-1">
                    <li>• You'll need to enter your password to confirm</li>
                    <li>• A confirmation email will be sent to your new address</li>
                    <li>• Your email won't change until you confirm it</li>
                    <li>• You can still use your current email until then</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Change Email Address
            </Button>
          </form>
        </CardContent>
      </Card>



      {/* Email Sent Confirmation */}
      <Dialog open={showEmailSent} onOpenChange={setShowEmailSent}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-blue-600">Confirmation Email Sent!</DialogTitle>
              <DialogDescription className="mt-2">
                We've sent a confirmation email to your new address. Please check your inbox and click the confirmation link to complete the email change.
              </DialogDescription>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 space-y-1">
                <li>1. Check your new email inbox</li>
                <li>2. Click the confirmation link</li>
                <li>3. Your email will be updated automatically</li>
              </ol>
            </div>
            <Button
              onClick={() => setShowEmailSent(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailChangeForm;
