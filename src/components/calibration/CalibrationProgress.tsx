
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CalibrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const CalibrationProgress: React.FC<CalibrationProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <Card className="bg-white/95">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Calibration Progress</span>
          <span className="text-sm text-gray-600">{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-golf-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalibrationProgress;
