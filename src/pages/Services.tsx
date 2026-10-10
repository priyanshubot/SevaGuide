import React, { useState, useMemo } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Search, X, SlidersHorizontal, Info } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Identity',
  'Certificates',
  'Pensions',
  'Transport',
  'Travel & Immigration',
  'Taxation',
];

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter services by search term and category
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;

      const query = searchTerm.toLowerCase();
      const inName = service.name.toLowerCase().includes(query);
      const inDesc = service.description.toLowerCase().includes(query);
      const inCategory = service.category.toLowerCase().includes(query);
      const inDocs = service.requiredDocuments.some(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          (doc.acceptedExamples &&
            doc.acceptedExamples.some((ex) => ex.toLowerCase().includes(query)))
      );

      return inName || inDesc || inCategory || inDocs;
    });
  }, [searchTerm, selectedCategory]);

  // Compute category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SERVICES_DATA.length };
    SERVICES_DATA.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Government Services Directory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Browse verified administrative guidance for central and Chhattisgarh state citizen services.
          Understand eligibility, inspect required and conditional documents, and prepare your checklist before applying.
        </p>
      </div>

      {/* Guidance Note */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-950 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Official Guidelines & Variable Requirements:</span>{' '}
          Services marked with <span className="font-semibold text-amber-700 dark:text-amber-400">Conditional</span> have document checklists that vary based on applicant age, community category, or existing proof availability. Always confirm live requirements on the linked official government portal.
        </div>
      </div>

      {/* Controls: Search Bar & Category Filter Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services or document proofs (e.g. Aadhaar, Domicile, Pension, Driving Licence)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredServices.length}</strong> of{' '}
          {SERVICES_DATA.length} services
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>

        {(selectedCategory !== 'All' || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              No matching government services found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search terms or clearing the category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Show All Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};