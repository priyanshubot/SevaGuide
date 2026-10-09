import React from 'react';
import { Check, ClipboardList, UploadCloud, Send } from 'lucide-react';

interface ServiceWorkflowStepsProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

export const ServiceWorkflowSteps: React.FC<ServiceWorkflowStepsProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { number: 1, title: 'Document Checklist', icon: ClipboardList },
    { number: 2, title: 'Upload & Verify', icon: UploadCloud },
    { number: 3, title: 'Choose Online / Offline', icon: Send },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-8 right-8 top-4 sm:top-5 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-zinc-800 z-0" />

        {/* Active track line */}
        <div
          className="absolute left-8 top-4 sm:top-5 -translate-y-1/2 h-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-300 z-0"
          style={{
            width:
              currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 4rem)',
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isClickable = Boolean(onStepClick && step.number <= currentStep);
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick && isClickable && onStepClick(step.number as 1 | 2 | 3)}
              className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none transition group ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/80 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                Step {step.number}: {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
