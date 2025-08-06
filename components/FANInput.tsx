'use client';

import React, { useState, useId } from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control } from 'react-hook-form';

interface FANInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
}

const FANInput = ({ control, name, label, placeholder }: FANInputProps) => {
  const id = useId();
  const fieldId = `${name}-field-${id}`;

  // Format FAN number as user types (1234-5678-9012-3456)
  const formatFAN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    
    // Add dashes every 4 digits
    const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1-');
    
    return formatted;
  };

  // Remove formatting for validation (return only digits)
  const unformatFAN = (value: string) => {
    return value.replace(/\D/g, '');
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item group">
          <FormLabel 
            htmlFor={fieldId}
            className="form-label text-gray-700 font-semibold text-sm mb-2 block transition-colors duration-200 group-focus-within:text-green-600"
          >
            {label}
          </FormLabel>
          <div className="flex w-full flex-col relative">
            <FormControl>
              <Input
                id={fieldId}
                placeholder={placeholder}
                className="eth-input h-12 text-base font-medium placeholder:text-gray-400 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg font-mono tracking-wider"
                type="text"
                value={formatFAN(field.value || '')}
                onChange={(e) => {
                  const formattedValue = formatFAN(e.target.value);
                  const unformattedValue = unformatFAN(formattedValue);
                  field.onChange(unformattedValue); // Store unformatted value
                }}
                onBlur={field.onBlur}
                name={field.name}
                maxLength={19} // 16 digits + 3 dashes
              />
            </FormControl>
            
            {/* FAN Number Helper */}
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <span className="text-blue-500">💡</span>
              <span>Enter your 16-digit Ethiopian FAN number</span>
            </div>
            
            {/* Character Counter */}
            <div className="mt-1 text-xs text-gray-400 text-right">
              {unformatFAN(field.value || '').length}/16 digits
            </div>
            
            <FormMessage className="form-message mt-2 text-red-500 text-sm font-medium" />
          </div>
        </div>
      )}
    />
  );
};

export default FANInput;
