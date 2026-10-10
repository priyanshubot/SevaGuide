import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AIAssistantDrawer } from '../components/AIAssistantDrawer';
import { FloatingQuickAccessToolbar } from '../components/FloatingQuickAccessToolbar';
import { SERVICES_DATA } from '../data/services';

export const MainLayout: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();

  // Extract active service from /services/:id or /verify/:id
  const serviceMatch = location.pathname.match(/^\/(?:services|verify)\/([^/]+)/);
  const activeServiceId = serviceMatch ? serviceMatch[1] : undefined;
  const activeService = activeServiceId ? SERVICES_DATA.find((s) => s.id === activeServiceId) : undefined;

  const aiContext = activeService
    ? {
        activeServiceId: activeService.id,
        activeServiceName: activeService.name,
        activeServiceCategory: activeService.category,
      }
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 relative">
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"><Outlet /></main>
      <Footer />
      <FloatingQuickAccessToolbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpen={() => setIsAssistantOpen(true)}
        context={aiContext}
      />
    </div>
  );
};