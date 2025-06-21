
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalibrationTips: React.FC = () => {
  const tips = [
    { icon: "📱", label: "Position", text: "Phone in front of your body, facing the ball" },
    { icon: "☀️", label: "Lighting", text: "Use natural daylight when possible" },
    { icon: "🎯", label: "Background", text: "Place ball against contrasting background" },
    { icon: "🤳", label: "Angle", text: "Keep phone level with the ball height" },
    { icon: "🔄", label: "Recalibrate", text: "If changing ball type or lighting conditions" }
  ];

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="text-lg">Calibration Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tips.map((tip, index) => (
          <div key={index} className="text-sm">
            {tip.icon} <strong>{tip.label}:</strong> {tip.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CalibrationTips;
