import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { FamilyMember, FamilyRelationship } from '../types/family';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    full_name: string;
    relationship: string;
    date_of_birth?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) => Promise<void>;
  memberToEdit?: FamilyMember | null;
  suggestedManagementId: string;
}

const RELATIONSHIP_OPTIONS: FamilyRelationship[] = [
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother',
  'Guardian',
  'Other'
];

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  memberToEdit,
  suggestedManagementId
}) => {
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<string>('Father');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setFullName(memberToEdit.full_name);
      setRelationship(memberToEdit.relationship);
      setDateOfBirth(memberToEdit.date_of_birth || '');
      setEmail(memberToEdit.email || '');
      setPhone(memberToEdit.phone || '');
      setNotes(memberToEdit.notes || '');
    } else {
      setFullName('');
      setRelationship('Father');
      setDateOfBirth('');
      setEmail('');
      setPhone('');
      setNotes('');
    }
    setErrorMsg(null);
  }, [memberToEdit, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        full_name: fullName.trim(),
        relationship,
        date_of_birth: dateOfBirth || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save family member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-member-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/70 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="family-member-modal-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                {memberToEdit ? 'Edit Family Member' : 'Add Family Member'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Management ID:{' '}
                <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                  {memberToEdit ? memberToEdit.management_id : suggestedManagementId}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="full-name-input"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="full-name-input"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Aarav Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label
                htmlFor="relationship-select"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Relationship <span className="text-rose-500">*</span>
              </label>
              <select
                id="relationship-select"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              >
                {RELATIONSHIP_OPTIONS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date of Birth & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dob-input"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Date of Birth <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="dob-input"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label
                htmlFor="phone-input"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email-input"
              className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Email Address <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes-input"
              className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Notes & Information <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Applies for secondary scholarship; passport applicant."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none transition"
            />
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
            Note: Family Management IDs are internal household records for SevaGuide document indexing and do not represent government identity numbers.
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : memberToEdit ? 'Save Changes' : 'Add Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
