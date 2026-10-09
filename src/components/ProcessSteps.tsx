import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProcessSteps: React.FC<{ steps: string[]; currentStepIndex: number }> = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all ${
                isCompleted
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-blue-700 border-blue-700 text-white ring-4 ring-blue-50 dark:ring-blue-950/60'
                  : 'bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-400 dark:text-slate-500'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-xs mt-2 font-medium max-w-[80px] text-center hidden sm:block ${
                isCurrent
                  ? 'text-blue-900 dark:text-blue-300 font-bold'
                  : isCompleted
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};