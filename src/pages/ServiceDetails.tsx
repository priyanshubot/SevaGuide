import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ProcessSteps } from '../components/ProcessSteps';
import { DocumentRequirementCard } from '../components/DocumentRequirementCard';
import { ShieldCheck, MapPin } from 'lucide-react';

export const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);

  if (!service) return <div>Service not found</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{service.name}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{service.description}</p>
      </div>
      <ProcessSteps steps={service.steps} currentStepIndex={0} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Required Documents</h3>
          {service.requiredDocuments.map((doc) => <DocumentRequirementCard key={doc.id} doc={doc} />)}
        </div>
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4 h-fit transition-colors">
          <h4 className="font-bold text-slate-900 dark:text-white">Service Details</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Fee: <strong className="text-slate-900 dark:text-slate-200">{service.fee}</strong></p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Time: <strong className="text-slate-900 dark:text-slate-200">{service.processingTime}</strong></p>
          <Link to={`/verify/${service.id}`} className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition shadow-sm"><ShieldCheck className="w-4 h-4" /> Verify Documents</Link>
          <Link to={`/offices/${service.id}`} className="w-full flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl border border-transparent dark:border-zinc-800 transition"><MapPin className="w-4 h-4" /> Find Office</Link>
        </div>
      </div>
    </div>
  );
};