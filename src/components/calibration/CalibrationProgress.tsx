
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CalibrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const CalibrationProgress: React.FC<CalibrationProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Calibration Progress</span>
          <span className="text-sm text-muted-foreground">{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-golf-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalibrationProgress;
