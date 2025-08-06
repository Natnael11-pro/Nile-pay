import React, { useId } from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath } from 'react-hook-form'

interface CustomInput {
  control: Control<any>,
  name: string,
  label: string,
  placeholder: string,
  onChange?: () => void
}

const CustomInput = ({ control, name, label, placeholder, onChange }: CustomInput) => {
  const id = useId();
  const fieldId = `${name}-field-${id}`;

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
                className="eth-input h-12 text-base font-medium placeholder:text-gray-400 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                type={name === 'password' || name === 'confirmPassword' ? 'password' : 'text'}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.();
                }}
              />
            </FormControl>
            <FormMessage className="form-message mt-2 text-red-500 text-sm font-medium" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput