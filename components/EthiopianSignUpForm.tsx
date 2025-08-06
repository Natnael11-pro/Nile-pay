'use client';

import React, { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, Upload, Camera, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/actions/user.actions';
import CustomInput from './CustomInput';
import FANInput from './FANInput';
import Image from 'next/image';


// Ethiopian-specific form schema
const ethiopianSignUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  phone: z.string().regex(/^(\+251|0)?[79]\d{8}$/, "Please enter a valid Ethiopian phone number (e.g., +251911234567)"),
  city: z.string().min(1, "Please enter your city").max(100, "City name is too long"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter date in YYYY-MM-DD format"),
  nationalId: z.string().regex(/^\d{16}$/, "Please enter a valid 16-digit Ethiopian FAN number"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EthiopianSignUpFormData = z.infer<typeof ethiopianSignUpSchema>;

const EthiopianSignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EthiopianSignUpFormData>({
    resolver: zodResolver(ethiopianSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
      dateOfBirth: "",
      nationalId: "",
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EthiopianSignUpFormData) => {
    setIsLoading(true);

    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address1: `${data.city}, Ethiopia`,
        city: data.city,
        state: "Ethiopia",
        postalCode: "0000", // Default for Ethiopia
        dateOfBirth: data.dateOfBirth,
        ssn: data.nationalId,
      };

      const newUser = await signUp(userData);

      if (newUser) {
        setUserEmail(data.email);
        setShowEmailConfirmation(true);
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      alert(error.message || 'Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email confirmation screen
  if (showEmailConfirmation) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-green-200">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Check Your Email! 🇪🇹
            </h2>
            <p className="text-gray-600">
              We've sent a confirmation email to:
            </p>
            <p className="font-semibold text-gray-800 mt-2">
              {userEmail}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Next Steps:</h3>
            <ol className="text-sm text-green-700 space-y-1 text-left">
              <li>1. Check your email inbox</li>
              <li>2. Click the confirmation link</li>
              <li>3. Return here to sign in</li>
              <li>4. Start using Nile Pay!</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/sign-in')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Go to Sign In
            </Button>

            <Button
              onClick={() => setShowEmailConfirmation(false)}
              variant="outline"
              className="w-full border-green-300 text-green-600 hover:bg-green-50"
            >
              Back to Sign Up
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Didn't receive the email? Check your spam folder or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Ethiopian Welcome Header */}
      <div className="text-center mb-8 eth-animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to <span className="eth-gradient-text">Nile Pay</span> 🇪🇹
        </h2>
        <p className="text-gray-600">
          Join thousands of Ethiopians using our secure digital payment platform
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="text-center mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-green-100 pb-2">
            📸 Profile Picture (Optional)
          </h3>

          <div className="flex flex-col items-center gap-4">
            {/* Profile Picture Preview */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center border-4 border-white shadow-lg">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-white" />
                )}
              </div>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <Camera className="h-4 w-4 mr-2" />
                {profileImage ? 'Change Picture' : 'Add Profile Picture'}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 5MB. Recommended: 200x200px
              </p>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-green-100 pb-2">
              📝 Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <CustomInput 
                control={form.control} 
                name='firstName' 
                label="First Name" 
                placeholder='e.g., Abebe' 
              />
              <CustomInput 
                control={form.control} 
                name='lastName' 
                label="Last Name" 
                placeholder='e.g., Kebede' 
              />
            </div>

            <CustomInput 
              control={form.control} 
              name='email' 
              label="Email Address" 
              placeholder='abebe.kebede@gmail.com' 
            />

            <CustomInput 
              control={form.control} 
              name='phone' 
              label="Phone Number" 
              placeholder='+251911234567 or 0911234567' 
            />

            <CustomInput 
              control={form.control} 
              name='dateOfBirth' 
              label="Date of Birth" 
              placeholder='1990-01-15 (YYYY-MM-DD)' 
            />

            <FANInput
              control={form.control}
              name='nationalId'
              label="Ethiopian FAN Number"
              placeholder='1234-5678-9012-3456'
            />

            {/* FAN Number Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">ℹ️</span>
                <div>
                  <p className="font-semibold text-blue-800 mb-1">About FAN Number</p>
                  <p className="text-xs">
                    Your FAN (Federal Account Number) is a 16-digit unique identifier issued by the Ethiopian government.
                    It's required for all financial transactions and banking services in Ethiopia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-green-100 pb-2">
              📍 Location Information
            </h3>

            <CustomInput
              control={form.control}
              name='city'
              label="City/Town"
              placeholder='e.g., Addis Ababa, Bahir Dar, Mekelle'
            />
          </div>

          {/* Account Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-green-100 pb-2">
              🔒 Account Security
            </h3>

            <CustomInput
              control={form.control}
              name='password'
              label="Password"
              placeholder='Create a strong password (min. 8 characters)'
            />

            <CustomInput
              control={form.control}
              name='confirmPassword'
              label="Confirm Password"
              placeholder='Confirm your password'
            />

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">💡</span>
                <div>
                  <p className="font-semibold text-blue-800 mb-1">Password Requirements</p>
                  <ul className="text-xs space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Ethiopian Terms and Conditions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">🛡️</span>
              <div>
                <p className="font-semibold text-green-800 mb-1">Ethiopian Banking Compliance</p>
                <p>
                  By creating an account, you agree to comply with Ethiopian banking regulations 
                  and confirm that you are a resident of Ethiopia. Your data is protected under 
                  Ethiopian data protection laws.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="eth-btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin mr-2" />
                Creating Your Account...
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Create My Nile Pay Account
              </>
            )}
          </Button>

          {/* Ethiopian Trust Indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-4">
            <div className="flex items-center gap-1 justify-center">
              <span className="text-green-500">🏦</span>
              All Ethiopian Banks
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="text-yellow-500">⚡</span>
              Instant ETB Transfers
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="text-red-500">🔒</span>
              Bank-Level Security
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="text-blue-500">🇪🇹</span>
              Made for Ethiopia
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EthiopianSignUpForm;
