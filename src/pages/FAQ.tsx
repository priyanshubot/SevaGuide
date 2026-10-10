import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'General',
      question: 'Is SevaGuide an official government website?',
      answer: 'No. SevaGuide is an independent, non-commercial civic-tech guidance platform. We do not issue documents, collect government fees, or approve applications. We help citizens verify that their documentation meets official guidelines before visiting official portals or seva kendras.',
    },
    {
      category: 'Document Verification',
      question: 'How does Document Verification work, and are my files private?',
      answer: 'Our document verification runs Optical Character Recognition (OCR) directly inside your web browser via Tesseract.js. Your document images are not sent to third-party commercial AI services. If you choose to save verified documents to your vault, they are stored securely in your private, authenticated Supabase storage folder protected by Row-Level Security.',
    },
    {
      category: 'Verification & OCR',
      question: 'What happens if the automated OCR cannot read a letter on my document?',
      answer: 'You have full control to manually review and correct any misread letters or digits directly in the Citizen Review section. As soon as you correct a value, the consistency checks immediately recalculate.',
    },
    {
      category: 'Services',
      question: 'Can I submit my passport, Aadhaar, or DL application directly through SevaGuide?',
      answer: 'No. Statutory government applications must be submitted through their designated official websites (such as uidai.gov.in, passportindia.gov.in, or parivahan.gov.in) or at an authorized facilitation center. SevaGuide provides direct verified links to these portals once your documents are ready.',
    },
    {
      category: 'Offices & Centers',
      question: 'How do I locate a Seva Kendra or facilitation center near me?',
      answer: 'Visit our Office Locator page (/offices) or click the "Find Facilitation Office" action on any service guide. You can search by district or use device location to view addresses, operational hours, and contact details.',
    },
    {
      category: 'Fees',
      question: 'Does SevaGuide charge any fees for using the platform?',
      answer: 'No. SevaGuide is completely free to use for all citizens. Any fees mentioned on service cards (such as ₹50 for Aadhaar demographic update or ₹1,500 for normal passport) are the statutory government fees payable directly to the official government authorities.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Common Questions & Guidance
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Everything you need to know about using SevaGuide, document verification privacy, and official application workflows.
        </p>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-zinc-900">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Have more questions */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Have a question not listed here?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Send us your question or observation through our feedback form.</p>
        </div>
        <Link
          to="/feedback"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs shrink-0"
        >
          <span>Submit Feedback</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
