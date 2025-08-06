'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, X } from 'lucide-react';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string[];
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

const SuccessDialog = ({
  isOpen,
  onClose,
  title,
  message,
  details,
  actionLabel = 'Continue',
  onAction,
  icon,
  color = 'green'
}: SuccessDialogProps) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      button: 'bg-green-600 hover:bg-green-700',
      icon: 'text-green-500'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-500'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-500'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-800 dark:text-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: 'text-orange-500'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-500'
    }
  };

  const colors = colorClasses[color];

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${colors.bg} ${colors.border} border`}>
                {icon || <CheckCircle className={`h-6 w-6 ${colors.icon}`} />}
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
            <p className={`${colors.text} text-sm`}>
              {message}
            </p>
            
            {details && details.length > 0 && (
              <div className="mt-3 space-y-1">
                {details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${colors.icon} mt-2 flex-shrink-0`}></div>
                    <p className={`${colors.text} text-xs`}>
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleAction}
              className={`flex-1 text-white ${colors.button}`}
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
