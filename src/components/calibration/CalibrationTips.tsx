
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalibrationTips: React.FC = () => {
  const tips = [
    { label: "Position", text: "Phone in front of your body, facing the ball" },
    { label: "Lighting", text: "Use natural daylight when possible" },
    { label: "Background", text: "Place ball against contrasting background" },
    { label: "Angle", text: "Keep phone level with the ball height" },
    { label: "Recalibrate", text: "If changing ball type or lighting conditions" }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Calibration Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex space-x-3">
            <div className="w-2 h-2 bg-golf-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm">
              <span className="font-medium text-foreground">{tip.label}:</span>
              <span className="text-muted-foreground ml-1">{tip.text}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalibrationTips;
