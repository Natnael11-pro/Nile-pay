'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { updateUserProfile } from '@/lib/actions/user.actions';
import { ethiopianRegions } from '@/lib/utils';
import { Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuccessDialog from './SuccessDialog';

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  phone: z.string().regex(/^(\+251|0)?[79]\d{8}$/, "Please enter a valid Ethiopian phone number").optional().or(z.literal('')),
  nationalId: z.string().regex(/^\d{16}$/, "FAN number must be exactly 16 digits").optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  city: z.string().min(1, "Please enter your city").optional().or(z.literal('')),
  region: z.string().min(1, "Please select your region"),
  preferredLanguage: z.string().min(1, "Please select your preferred language"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileFormProps {
  user: any;
}

const UserProfileForm = ({ user }: UserProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || user?.first_name || '',
      lastName: user?.lastName || user?.last_name || '',
      phone: user?.phone || '',
      nationalId: user?.national_id || '',
      dateOfBirth: user?.date_of_birth || '',
      city: user?.city || '',
      region: user?.region || '',
      preferredLanguage: user?.preferred_language || 'en',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await updateUserProfile({
        userId: user.$id || user.id,
        updates: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || undefined,
          national_id: data.nationalId || undefined,
          date_of_birth: data.dateOfBirth || undefined,
          city: data.city || undefined,
          region: data.region,
          preferred_language: data.preferredLanguage,
        }
      });

      if (result) {
        setMessage('');
        setShowSuccessDialog(true);
      } else {
        setMessage('❌ Failed to update profile. Please try again.');
      }
    } catch (error) {
      setMessage('❌ An error occurred. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>👤</span>
          Personal Information
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Update your personal details and preferences
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Abebe"
                        className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Kebede"
                        className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                    <span>📞</span>
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+251911234567 or 0911234567"
                      className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            {/* FAN Number Field */}
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                    <span>🆔</span>
                    FAN Number (Ethiopian National ID)
                    {user?.national_id && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {user?.national_id ? (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        <div className="font-mono text-gray-900 dark:text-gray-100 tracking-wider">
                          {user.national_id.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4')}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          FAN number cannot be changed once set for security reasons
                        </p>
                      </div>
                    ) : (
                      <>
                        <Input
                          {...field}
                          placeholder="1234567890123456"
                          maxLength={16}
                          className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-mono"
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">16-digit Ethiopian National ID number</p>
                      </>
                    )}
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            {/* Date of Birth and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🎂</span>
                      Date of Birth
                      {user?.date_of_birth && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Set</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {user?.date_of_birth ? (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                          <div className="text-gray-900 dark:text-gray-100">
                            {new Date(user.date_of_birth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Date of birth cannot be changed once set for security reasons
                          </p>
                        </div>
                      ) : (
                        <Input
                          {...field}
                          type="date"
                          className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🏙️</span>
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Addis Ababa"
                        className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Region and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🇪🇹</span>
                      Region
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ethiopianRegions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <div>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      <span>🗣️</span>
                      Preferred Language
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                        <SelectItem value="or">Oromiffa</SelectItem>
                        <SelectItem value="ti">ትግርኛ (Tigrinya)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                <>
                  <span className="mr-2">💾</span>
                  Update Profile
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>

    {/* Success Dialog */}
    <SuccessDialog
      isOpen={showSuccessDialog}
      onClose={() => {
        setShowSuccessDialog(false);
        router.refresh();
      }}
      title="Profile Updated Successfully"
      message="Your personal information has been updated and saved to your Ethiopian Banking account."
      details={[
        'All changes have been saved',
        'Your profile information is now up to date',
        'Changes are visible across all pages',
        'Your Ethiopian Banking profile is secure'
      ]}
      icon={<User className="h-6 w-6 text-green-500" />}
      color="green"
      actionLabel="Continue"
      onAction={() => {
        setShowSuccessDialog(false);
        router.refresh();
      }}
    />
    </>
  );
};

export default UserProfileForm;
