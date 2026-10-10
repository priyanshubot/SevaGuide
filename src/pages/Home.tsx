import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { CivicAlerts } from '../components/CivicAlerts';
import { NearbySevaKendras } from '../components/NearbySevaKendras';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POPULAR_SERVICE_IDS = [
  'aadhaar-enrolment',
  'aadhaar-update',
  'passport-application',
];

export const Home: React.FC = () => {
  const { user } = useAuth();
  const getStartedRoute = user ? '/profile' : '/login';

  const popularServices = POPULAR_SERVICE_IDS.map((id) =>
    SERVICES_DATA.find((s) => s.id === id)
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="space-y-12">
      {/* 2. Hero Section with Civic Background Image */}
      <section className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-black transition-colors">
        {/* Civic Hero Banner Graphic */}
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat pointer-events-none opacity-90 dark:opacity-35 transition-opacity"
          style={{ backgroundImage: `url('/hero-banner.png')` }}
          aria-hidden="true"
        />

        {/* Soft Multi-Stop Gradient Overlays ensuring text readability */}
        {/* Light mode: soft white wash on left so typography pops while 3D citizen and documents shine through on right */}
        {/* Dark mode: deep AMOLED pitch-black blend */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:from-white/95 sm:via-white/70 sm:to-transparent dark:from-black dark:via-black/90 dark:to-black/40 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-black/80 dark:via-transparent dark:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-12">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs">
              <span>Citizen Guidance Platform</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Government services, without the confusion.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              Check document requirements, verify paperwork readiness, and find authorized seva kendras.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={getStartedRoute}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg transition border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-2xs"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Popular Services</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Most accessed citizen facilitation workflows</p>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
          >
            <span>All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} compact />
          ))}
        </div>
      </section>

      {/* 4. Civic Alerts Sliding Banner */}
      <div id="civic-alerts">
        <CivicAlerts />
      </div>

      {/* 5. Nearby Seva Kendras Map Section */}
      <NearbySevaKendras />
    </div>
  );
};