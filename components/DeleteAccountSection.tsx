'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Trash2, AlertTriangle, Loader2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuccessDialog from './SuccessDialog';

interface DeleteAccountSectionProps {
  user: any;
}

const DeleteAccountSection = ({ user }: DeleteAccountSectionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setShowDeleteDialog(false);
        setShowSuccessDialog(true);
      } else {
        alert(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setConfirmationText('');
    }
  };

  return (
    <>
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Permanent Account Deletion
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    This action cannot be undone. Deleting your account will:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 ml-4">
                    <li>• Remove all your personal information</li>
                    <li>• Delete all transaction history</li>
                    <li>• Automatically disconnect all linked bank accounts</li>
                    <li>• Cancel any pending transfers</li>
                    <li>• Permanently close your Nile Pay account</li>
                    <li>• You will be signed out immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Before You Delete
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please ensure you have withdrawn all funds from your accounts.
                    Accounts with remaining balance cannot be deleted. All linked bank accounts
                    will be automatically disconnected when you delete your profile.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                You are about to permanently delete the account for:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-md p-3 border">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type "DELETE MY ACCOUNT" to confirm:
              </Label>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="mt-2 font-mono"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setConfirmationText('');
                }}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isDeleting || confirmationText !== 'DELETE MY ACCOUNT'}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          router.push('/sign-in');
        }}
        title="Account Deleted Successfully"
        message="Your Nile Pay account has been permanently deleted. All your data has been removed from our system."
        details={[
          'All personal information has been deleted',
          'All bank accounts have been disconnected',
          'All transaction history has been removed',
          'You have been signed out of all devices',
          'Thank you for using Nile Pay Ethiopian Banking'
        ]}
        icon={<UserX className="h-6 w-6 text-red-500" />}
        color="red"
        actionLabel="Go to Sign In"
        onAction={() => router.push('/sign-in')}
      />
    </>
  );
};

export default DeleteAccountSection;
