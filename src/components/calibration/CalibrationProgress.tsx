
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CalibrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const CalibrationProgress: React.FC<CalibrationProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-black">Calibration Progress</span>
          <span className="text-lg text-gray-600">{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalibrationProgress;
