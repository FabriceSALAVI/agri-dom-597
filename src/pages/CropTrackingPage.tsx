import React from 'react';
import { CropTrackingEvaluation } from '@/components/CropTrackingEvaluation';
import PageLayout from '@/components/layout/PageLayout';

const CropTrackingPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi et Évaluation des Cultures
          </h1>
          <p className="text-gray-600">
            Surveillance continue et évaluation des performances de vos cultures
          </p>
        </div>
        <CropTrackingEvaluation />
      </div>
    </PageLayout>
  );
};

export default CropTrackingPage;