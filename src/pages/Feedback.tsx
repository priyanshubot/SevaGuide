import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, Check, Copy, AlertCircle, ArrowLeft, Send } from 'lucide-react';

interface FeedbackItem {
  id: string;
  category: string;
  rating: number;
  message: string;
  email?: string;
  submittedAt: string;
}

export const Feedback: React.FC = () => {
  const [category, setCategory] = useState('Guidance Clarity');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submittedItem, setSubmittedItem] = useState<FeedbackItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    'Guidance Clarity',
    'Document Verification & OCR',
    'Office Locator & Maps',
    'Government Service Accuracy',
    'General Suggestion',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = message.trim();
    if (!trimmed) {
      setErrorMessage('Please provide your feedback comments or observations.');
      return;
    }

    if (trimmed.length < 10) {
      setErrorMessage('Please provide a slightly more descriptive message (at least 10 characters).');
      return;
    }

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      category,
      rating,
      message: trimmed,
      email: email.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    // Save to local session prototype log
    try {
      const stored = localStorage.getItem('sevaguide_feedback_history');
      const list: FeedbackItem[] = stored ? JSON.parse(stored) : [];
      list.unshift(newFeedback);
      localStorage.setItem('sevaguide_feedback_history', JSON.stringify(list.slice(0, 20)));
    } catch {
      // Local storage fallback
    }

    setSubmittedItem(newFeedback);
  };

  const handleCopySummary = () => {
    if (!submittedItem) return;
    const summary = `SevaGuide Feedback Summary:
Category: ${submittedItem.category}
Rating: ${submittedItem.rating}/5 Stars
Message: ${submittedItem.message}
Submitted: ${new Date(submittedItem.submittedAt).toLocaleString()}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setMessage('');
    setEmail('');
    setSubmittedItem(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
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
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Citizen Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Us Improve SevaGuide
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Your insights help make government documentation guides clearer, faster, and more accessible for fellow citizens.
        </p>
      </div>

      {submittedItem ? (
        <div className="bg-white dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                Feedback Recorded in Prototype Session
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Thank you for your response! Your entry has been saved to your browser session storage.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-4 text-xs space-y-2 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
              <span className="font-semibold text-slate-500">Category:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedItem.category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
              <span className="font-semibold text-slate-500">Rating:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedItem.rating} of 5 Stars</span>
            </div>
            <div className="pt-1">
              <span className="font-semibold text-slate-500 block mb-1">Your Comments:</span>
              <p className="italic text-slate-800 dark:text-slate-200 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                "{submittedItem.message}"
              </p>
            </div>
          </div>

          {/* Honest Technical Notice */}
          <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Technical Transparency:</strong> This prototype runs client-side without an external feedback database endpoint. Your feedback is preserved in local session storage. You can copy the summary below to forward to project maintainers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Feedback Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Feedback Topic
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs text-left font-semibold border transition cursor-pointer ${
                    category === cat
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Overall Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    rating >= star
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-300 dark:text-zinc-700 hover:text-slate-400'
                  }`}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
                {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Needs Work' : 'Poor'}
              </span>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Feedback or Suggestion <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What worked well? What government requirements or steps were confusing?"
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Optional Contact Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Email <span className="text-slate-400 font-normal lowercase">(optional, if you'd like a response)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@example.com"
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
