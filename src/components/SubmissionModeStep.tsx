import React, { useState, useMemo } from 'react';
import { Service, Office } from '../types';
import { OFFICES_DATA } from '../data/offices';
import { OfficeMap } from './OfficeMap';
import { ExternalPortalModal } from './ExternalPortalModal';
import {
  Globe,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Crosshair,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SubmissionModeStepProps {
  service: Service;
  onBack: () => void;
  onHome: () => void;
}

// Fallback official locator links for services without local centre data
function getOfficialLocatorLink(service: Service): { name: string; url: string } {
  const sid = service.id;
  if (sid.includes('aadhaar')) {
    return {
      name: 'UIDAI Bhuvan Aadhaar Seva Kendra Locator',
      url: 'https://appointments.uidai.gov.in/easearch.aspx',
    };
  }
  if (sid.includes('passport')) {
    return {
      name: 'Passport Seva Kendra (PSK / POPSK) Locator',
      url: 'https://www.passportindia.gov.in/AppOnlineProject/locatePSK/locatePSK',
    };
  }
  if (sid.includes('dl-') || sid.includes('driving')) {
    return {
      name: 'Parivahan National RTO Office Directory',
      url: 'https://parivahan.gov.in/parivahan//en/content/rto-offices',
    };
  }
  if (sid.includes('cg-')) {
    return {
      name: 'Chhattisgarh Lok Seva Kendra (LSK) Directory',
      url: 'https://edistrict.cgstate.gov.in/',
    };
  }
  return {
    name: 'Protean TIN-FC & PAN Facilitation Centres',
    url: 'https://www.tin-nsdl.com/tin-facilities.html',
  };
}

// Haversine distance calculator in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const SubmissionModeStep: React.FC<SubmissionModeStepProps> = ({
  service,
  onBack,
  onHome,
}) => {
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Relevant centres filtered by service ID
  const relevantCentres = useMemo(() => {
    return OFFICES_DATA.filter((office) => office.serviceIds.includes(service.id));
  }, [service.id]);

  // Filter and enrich centres by user search and geolocation
  const filteredCentres = useMemo(() => {
    let list = relevantCentres;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }

    if (userLocation) {
      return list.map((office) => ({
        ...office,
        calculatedDistanceKm: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          office.latitude,
          office.longitude
        ),
      })).sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
    }

    return list.map((office) => ({
      ...office,
      calculatedDistanceKm: office.distanceKm,
    }));
  }, [relevantCentres, searchQuery, userLocation]);

  const [selectedOffice, setSelectedOffice] = useState<Office | null>(() => {
    return relevantCentres[0] || null;
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError('Unable to retrieve your location. You can search by city or PIN code.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const officialLocator = getOfficialLocatorLink(service);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
          <span>Step 3 of 3: Choose Application Method</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Choose Online or Offline Submission
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your documents are prepared for {service.name}. Select how you would like to proceed.
        </p>
      </div>

      {/* Two Large Clear Cards: Online vs Offline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* =================================================================== */}
        {/* CARD 1: COMPLETE ONLINE                                             */}
        {/* =================================================================== */}
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Digital Submission
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Complete Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Submit your application directly through the verified official portal.
              </p>
            </div>

            {/* Official destination box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold">
                  {service.officialPortalName || 'Official Government Portal'}
                </span>
                <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              </div>
              <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate">
                {service.officialPortalUrl}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                Fee: {service.fee} • Processing: {service.processingTime}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowExternalModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-sm hover:shadow transition cursor-pointer"
            >
              <span>Continue to Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CARD 2: VISIT A CENTRE                                              */}
        {/* =================================================================== */}
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-800">
                In-Person Visit
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Visit a Centre
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Visit an authorized facilitation centre in person to submit physical documents.
              </p>
            </div>

            {/* Location search & Geolocation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, district, or PIN..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  title="Detect nearby centres"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Near Me</span>
                </button>
              </div>

              {locationError && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  {locationError}
                </p>
              )}
            </div>

            {/* Matching Centres List or Fallback */}
            {filteredCentres.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredCentres.map((office) => (
                  <div
                    key={office.id}
                    onClick={() => setSelectedOffice(office)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                      selectedOffice?.id === office.id
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-600/20'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-black'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {office.name}
                      </h4>
                      {typeof office.calculatedDistanceKm === 'number' && (
                        <span className="font-mono text-[11px] text-blue-700 dark:text-blue-300 font-semibold shrink-0">
                          {office.calculatedDistanceKm} km
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>
                    {office.hours && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{office.hours}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Honest Fallback when no centres match */
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>No Local Centres on File</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  No pre-verified physical centres on file for this specific search. Locate official centres directly through the verified government directory:
                </p>
                <a
                  href={officialLocator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>{officialLocator.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Map Preview for selected office */}
          {selectedOffice && (
            <div className="pt-2">
              <OfficeMap office={selectedOffice} />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Document Verification</span>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-transparent dark:border-zinc-800 transition cursor-pointer"
        >
          <span>All Government Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal before navigating to external website */}
      <ExternalPortalModal
        isOpen={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        portalName={service.officialPortalName || 'Official Government Portal'}
        portalUrl={service.officialPortalUrl || 'https://india.gov.in'}
      />
    </div>
  );
};
