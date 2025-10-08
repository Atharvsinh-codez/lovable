"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { useInputMask } from '@/hooks/useInputMask';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mask?: 'cpf' | 'cep' | 'placa' | 'telefone' | 'email';
  required?: boolean;
  loading?: boolean;
}

export function Input({ 
  label, 
  error, 
  mask, 
  required, 
  loading, 
  className, 
  ...props 
}: InputProps) {
  const inputRef = useInputMask(mask);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors",
            error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
            loading && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={loading}
          {...props}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-brand-primary"></div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}