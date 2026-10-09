import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Search,
  MapPin,
  Clock,
  Bell,
  HelpCircle,
  MessageSquare,
  Info,
  Layers,
  Phone,
  Home as HomeIcon,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0B1528] text-slate-300 border-t border-slate-800/80 overflow-hidden mt-auto">
      {/* Subtle Government Building & Geometric Architectural Vector Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          {/* Subtle civic dome and pillars silhouette */}
          <path
            d="M 100,400 L 100,320 L 150,320 L 150,400 M 170,400 L 170,320 L 220,320 L 220,400 M 240,400 L 240,320 L 290,320 L 290,400 M 60,320 L 330,320 L 310,270 L 80,270 Z M 195,270 A 90 90 0 0 1 285,180 L 105,180 A 90 90 0 0 1 195,270 Z M 195,180 L 195,140 M 195,140 L 210,147 L 195,155 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          {/* Subtle right-side architectural geometry */}
          <path
            d="M 900,400 L 900,300 L 950,300 L 950,400 M 970,400 L 970,300 L 1020,300 L 1020,400 M 1040,400 L 1040,300 L 1090,300 L 1090,400 M 870,300 L 1120,300 L 1100,250 L 890,250 Z M 995,250 A 80 80 0 0 1 1075,170 L 915,170 A 80 80 0 0 1 995,250 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          {/* Geometric grid lines */}
          <line x1="0" y1="360" x2="1200" y2="360" stroke="white" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke="white" strokeWidth="1" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Subtle Indian Tricolor Accent Line at top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500/80 via-white/40 to-emerald-500/80" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: SevaGuide Branding */}
          <div className="space-y-4 lg:pr-2">
            <Link to="/" className="inline-block hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg">
              <BrandLogo lightText={true} size="md" />
            </Link>

            <div>
              <span className="inline-block text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded">
                CITIZEN ASSISTANCE PORTAL
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Government services, simplified for everyone. Prepare, verify, find and track your documentation in one place.
            </p>

            {/* Badges accurately describing actual functionality */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-lg w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Prevention-First Guidance</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-300 bg-blue-950/50 border border-blue-800/60 px-2.5 py-1 rounded-lg w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Rule-Guided Document Checks</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-500">
              SERVICES
            </h3>
            <nav aria-label="Services Links" className="flex flex-col space-y-2 text-xs">
              <Link
                to="/services/aadhaar-update"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                Aadhaar Enrolment & Update
              </Link>
              <Link
                to="/services/pan-correction"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                PAN Card Correction
              </Link>
              <Link
                to="/services/passport-application"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                Passport Application
              </Link>
              <Link
                to="/services"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>Driving Licence (RTO)</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/60 px-1 rounded">Directory</span>
              </Link>
              <Link
                to="/services"
                className="text-amber-400 hover:text-amber-300 font-semibold transition pt-1 py-0.5 inline-flex items-center gap-1"
              >
                <span>View All Services</span>
                <span>&rarr;</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: What You Can Do */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-500">
              WHAT YOU CAN DO
            </h3>
            <nav aria-label="Feature Links" className="flex flex-col space-y-2 text-xs">
              <Link
                to="/services"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Service Requirements</span>
              </Link>
              <Link
                to="/verify/pan-correction"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Document Verification</span>
              </Link>
              <Link
                to="/offices"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Office Locator</span>
              </Link>
              <Link
                to="/applications"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Process Tracking</span>
              </Link>
              <Link
                to="/"
                onClick={() => {
                  const el = document.getElementById('civic-alerts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Bell className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Alerts & Reminders</span>
              </Link>
            </nav>
          </div>

          {/* Column 4: Official Portals */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-500">
              OFFICIAL PORTALS
            </h3>
            <nav aria-label="Official Government Portals" className="flex flex-col space-y-2 text-xs">
              <a
                href="https://uidai.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>UIDAI (Aadhaar)</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
              <a
                href="https://www.incometax.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>Income Tax Department</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
              <a
                href="https://www.passportindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>Passport Seva</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
              <a
                href="https://www.digilocker.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>DigiLocker</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
              <a
                href="https://www.myscheme.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>myScheme Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <span>CPGRAMS Grievances</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
              </a>
            </nav>
          </div>

          {/* Column 5: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-amber-500">
              QUICK LINKS
            </h3>
            <nav aria-label="Quick Links" className="flex flex-col space-y-2 text-xs">
              <Link
                to="/"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <HomeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Home</span>
              </Link>
              <Link
                to="/faq"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>FAQ</span>
              </Link>
              <Link
                to="/feedback"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Support & Feedback</span>
              </Link>
              <Link
                to="/about"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>About Us</span>
              </Link>
              <Link
                to="/services"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Resources & Guides</span>
              </Link>
              <Link
                to="/contact"
                className="text-slate-300 hover:text-white hover:underline transition py-0.5 flex items-center gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Contact Us</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Highlighted Disclaimer Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-xs text-slate-300">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Official Guidance Notice:</strong> SevaGuide is an independent guidance platform. It does not issue documents, approve applications or replace official government portals. Always confirm fees and rules on the official website.
          </p>
        </div>

        {/* Bottom Legal Navigation & Dynamic Copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {currentYear} SevaGuide Citizen Assistance Platform. Non-commercial civic assistance utility.
          </p>

          <nav aria-label="Legal Navigation" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
            <Link
              to="/privacy"
              className="text-slate-400 hover:text-white hover:underline transition focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-white hover:underline transition focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
            >
              Terms of Use
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link
              to="/feedback"
              className="text-slate-400 hover:text-white hover:underline transition focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
            >
              Feedback
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link
              to="/contact"
              className="text-slate-400 hover:text-white hover:underline transition focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};