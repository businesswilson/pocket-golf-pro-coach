
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalibrationInstructionsProps {
  step: number;
}

const CalibrationInstructions: React.FC<CalibrationInstructionsProps> = ({ step }) => {
  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Position Golf Ball",
          description: "Place your golf ball in the center of the frame below",
          instruction: "The ball should fill about 1/4 of the circular guide"
        };
      case 2:
        return {
          title: "Lighting Check",
          description: "Ensure good lighting conditions for accurate detection",
          instruction: "Avoid shadows and ensure the ball is clearly visible"
        };
      case 3:
        return {
          title: "Final Calibration",
          description: "Confirm ball detection and save settings",
          instruction: "Move the ball slightly to test tracking accuracy"
        };
      default:
        return {
          title: "Setup",
          description: "Prepare for ball calibration",
          instruction: "Follow the steps to calibrate your golf ball"
        };
    }
  };

  const stepInfo = getStepDescription(step);

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">{stepInfo.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{stepInfo.description}</p>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">💡 {stepInfo.instruction}</p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Camera Setup */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-800">📱 Critical Camera Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <div className="font-bold text-yellow-900 mb-2">⚠️ IMPORTANT: Phone Position</div>
            <div className="text-sm text-yellow-800 space-y-2">
              <div>• <strong>Stand BEHIND the ball</strong> (where you normally swing)</div>
              <div>• <strong>Hold phone IN FRONT of your body</strong>, facing the ball</div>
              <div>• Phone should be on the OPPOSITE side of the ball from you</div>
              <div>• Distance: 6-8 feet from the ball</div>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border">
            <div className="text-sm text-gray-700">
              <div className="font-semibold mb-1">Setup Diagram:</div>
              <div className="font-mono text-xs">
                YOU ← → 📱PHONE ← → ⚪BALL
              </div>
              <div className="text-xs text-gray-600 mt-1">
                (Phone is between you and the ball)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CalibrationInstructions;
