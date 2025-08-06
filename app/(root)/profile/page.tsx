import React from 'react';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import HeaderBox from '@/components/HeaderBox';
import UserProfileForm from '@/components/UserProfileForm';
import EmailChangeForm from '@/components/EmailChangeForm';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import DeleteAccountSection from '@/components/DeleteAccountSection';

const Profile = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <HeaderBox
        title="Profile Settings"
        subtext="Manage your personal information and account preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 overflow-hidden">
                {loggedIn?.avatar_url || loggedIn?.avatarUrl ? (
                  <img
                    src={loggedIn.avatar_url || loggedIn.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{loggedIn?.firstName?.[0]}{loggedIn?.lastName?.[0]}</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                {loggedIn?.firstName} {loggedIn?.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{loggedIn?.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <span>🇪🇹</span>
                <span>Ethiopian Banking</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">FAN Number:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 font-mono">
                  {loggedIn?.national_id ?
                    loggedIn.national_id.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4') :
                    'Not set'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Region:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{loggedIn?.region || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{loggedIn?.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {loggedIn?.date_of_birth ? new Date(loggedIn.date_of_birth).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">City:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{loggedIn?.city || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {loggedIn?.created_at ? new Date(loggedIn.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          <ProfilePictureUpload user={loggedIn} />
          <UserProfileForm user={loggedIn} />
          <EmailChangeForm user={loggedIn} />
          <DeleteAccountSection user={loggedIn} />
        </div>
      </div>
    </section>
  );
};

export default Profile;
