
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
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black">Calibration Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-base">
              <span className="font-semibold text-black">{tip.label}:</span>
              <span className="text-gray-600 ml-2">{tip.text}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalibrationTips;
