'use client';

import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const MobileLayout = ({ children, title, subtitle }: MobileLayoutProps) => {
  return (
    <div className="mobile-layout">
      {title && (
        <div className="mobile-page-header">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      <div className="mobile-page-content">
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
