'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import CustomReportsDialog from './CustomReportsDialog';

interface StatementsPageClientProps {
  accounts: any[];
  user: any;
}

const StatementsPageClient = ({ accounts, user }: StatementsPageClientProps) => {
  const [showCustomReports, setShowCustomReports] = useState(false);

  return (
    <>
      <Button 
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
        onClick={() => setShowCustomReports(true)}
      >
        <span className="mr-2">📊</span>
        Generate Custom Report
      </Button>

      <CustomReportsDialog
        isOpen={showCustomReports}
        onClose={() => setShowCustomReports(false)}
        accounts={accounts}
        user={user}
      />
    </>
  );
};

export default StatementsPageClient;
