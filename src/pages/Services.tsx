import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Search } from 'lucide-react';

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = SERVICES_DATA.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Government Services Directory</h1>
      </div>
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search services (e.g. Aadhaar, PAN, Passport)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
    </div>
  );
};