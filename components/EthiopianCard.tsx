'use client';

import React from 'react';
import { formatEthiopianBirr } from '@/lib/utils';

interface EthiopianCardProps {
  title: string;
  subtitle?: string;
  amount?: number;
  currency?: string;
  icon?: string;
  gradient?: 'primary' | 'sunset' | 'heritage' | 'highlands';
  pattern?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const EthiopianCard = ({
  title,
  subtitle,
  amount,
  currency = 'ETB',
  icon,
  gradient,
  pattern = false,
  children,
  onClick,
  className = ''
}: EthiopianCardProps) => {
  const getGradientClass = (gradientType?: string) => {
    switch (gradientType) {
      case 'primary':
        return 'bg-gradient-to-br from-green-600 to-emerald-500 text-white';
      case 'sunset':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white';
      case 'heritage':
        return 'bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 text-white';
      case 'highlands':
        return 'bg-gradient-to-br from-emerald-500 to-blue-600 text-white';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const cardClasses = `
    eth-card 
    ${getGradientClass(gradient)}
    ${pattern ? 'eth-pattern-dots' : ''}
    ${onClick ? 'cursor-pointer hover:scale-105' : ''}
    ${className}
    p-6 relative overflow-hidden
  `.trim();

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Ethiopian Flag Accent */}
      {gradient && (
        <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
          <div className="w-full h-1/3 bg-green-400"></div>
          <div className="w-full h-1/3 bg-yellow-400"></div>
          <div className="w-full h-1/3 bg-red-400"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${gradient ? 'bg-white/20' : 'bg-green-100'}
            `}>
              {icon}
            </div>
          )}
          <div>
            <h3 className={`
              font-bold text-lg leading-tight
              ${gradient ? 'text-white' : 'text-gray-900'}
            `}>
              {title}
            </h3>
            {subtitle && (
              <p className={`
                text-sm font-medium
                ${gradient ? 'text-white/80' : 'text-gray-600'}
              `}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Ethiopian Cultural Element */}
        <div className={`
          text-xs px-2 py-1 rounded-full font-medium
          ${gradient ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}
        `}>
          🇪🇹 ET
        </div>
      </div>

      {/* Amount Display */}
      {amount !== undefined && (
        <div className="mb-4">
          <div className={`
            text-3xl font-bold leading-none
            ${gradient ? 'text-white' : 'text-gray-900'}
          `}>
            {currency === 'ETB' ? formatEthiopianBirr(amount) : `${amount} ${currency}`}
          </div>
          <div className={`
            text-sm font-medium mt-1
            ${gradient ? 'text-white/80' : 'text-gray-600'}
          `}>
            Ethiopian Birr
          </div>
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="space-y-3">
          {children}
        </div>
      )}

      {/* Ethiopian Pattern Overlay */}
      {pattern && !gradient && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-yellow-400"></div>
        </div>
      )}
    </div>
  );
};

// Specialized Ethiopian Card Components
export const EthiopianBankCard = ({ 
  bankName, 
  accountNumber, 
  balance, 
  bankColor 
}: {
  bankName: string;
  accountNumber: string;
  balance: number;
  bankColor?: string;
}) => (
  <EthiopianCard
    title={bankName}
    subtitle={`Account: ${accountNumber}`}
    amount={balance}
    icon="🏦"
    gradient="primary"
    className="relative"
  >
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/80">Available Balance</span>
      <span className="text-white font-semibold">Active</span>
    </div>
    
    {/* Bank Color Indicator */}
    {bankColor && (
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: bankColor }}
      ></div>
    )}
  </EthiopianCard>
);

export const EthiopianTransactionCard = ({
  description,
  amount,
  type,
  date,
  status
}: {
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: string;
}) => (
  <EthiopianCard
    title={description}
    subtitle={new Date(date).toLocaleDateString('en-ET')}
    className="hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`
          w-3 h-3 rounded-full
          ${status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}
        `}></span>
        <span className="text-sm font-medium text-gray-600 capitalize">
          {status}
        </span>
      </div>
      <div className={`
        text-lg font-bold
        ${type === 'credit' ? 'text-green-600' : 'text-red-600'}
      `}>
        {type === 'credit' ? '+' : '-'}{formatEthiopianBirr(amount)}
      </div>
    </div>
  </EthiopianCard>
);

export const EthiopianStatsCard = ({
  title,
  value,
  change,
  icon,
  trend
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <EthiopianCard
    title={title}
    icon={icon}
    pattern={true}
  >
    <div className="space-y-2">
      <div className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? formatEthiopianBirr(value) : value}
      </div>
      {change && (
        <div className={`
          text-sm font-medium flex items-center gap-1
          ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}
        `}>
          {trend === 'up' && '↗️'}
          {trend === 'down' && '↘️'}
          {trend === 'neutral' && '➡️'}
          {change}
        </div>
      )}
    </div>
  </EthiopianCard>
);

export default EthiopianCard;
