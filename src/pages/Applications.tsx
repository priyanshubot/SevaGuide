import React from 'react';
import { UserApplications } from '../components/UserApplications';

export const Applications: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <UserApplications />
    </div>
  );
};