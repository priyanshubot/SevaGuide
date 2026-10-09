import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    <p>{message}</p>
  </div>
);

export const ErrorState: React.FC<{ title?: string; message?: string }> = ({ title = 'Something went wrong', message = 'Failed to load details.' }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-center my-6 max-w-md mx-auto space-y-2">
    <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
    <h4 className="font-bold">{title}</h4>
    <p className="text-xs text-red-700">{message}</p>
  </div>
);